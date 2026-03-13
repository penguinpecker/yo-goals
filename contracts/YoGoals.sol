// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title IERC4626 - Minimal interface for YO Protocol vault interactions
interface IERC4626 {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
    function previewDeposit(uint256 assets) external view returns (uint256 shares);
    function previewRedeem(uint256 shares) external view returns (uint256 assets);
    function convertToAssets(uint256 shares) external view returns (uint256 assets);
    function convertToShares(uint256 assets) external view returns (uint256 shares);
    function asset() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

/// @title YoGoals
/// @author penguinpecker
/// @notice Goal-based DeFi savings with AI-optimized multi-vault strategies on Base
/// @dev Deposits into multiple YO Protocol ERC-4626 vaults per goal, collects 10% yield fee on withdrawal
///
/// Architecture:
///   User → YoGoals contract → multiple YO vaults (yoUSD, yoETH, yoBTC)
///   On withdraw: profit calculated per vault, 10% fee sent to treasury, 90% to user
///
/// Base Mainnet Addresses:
///   yoUSD: 0x0000000f2eB9f69274678c76222B35eEc7588a65  (USDC, 6 decimals)
///   yoETH: 0x3a43aec53490cb9fa922847385d82fe25d0e9de7  (WETH, 18 decimals)
///   yoBTC: 0xbCbc8cb4D1e8ED048a6276a5E94A3e952660BcbC  (cbBTC, 8 decimals)
///   USDC:  0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
///   WETH:  0x4200000000000000000000000000000000000006

contract YoGoals is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── CONSTANTS ───────────────────────────────────────────
    
    uint256 public constant FEE_BPS = 1000;          // 10% = 1000 basis points
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MAX_ALLOCATIONS = 5;       // Max vaults per goal

    // ─── STATE ───────────────────────────────────────────────

    /// @notice Treasury wallet that receives yield fees and funds x402 API calls
    address public treasury;

    /// @notice Total fees collected across all goals (for transparency)
    uint256 public totalFeesCollected;

    /// @notice Whitelisted YO vaults that strategies can allocate to
    mapping(address => bool) public whitelistedVaults;
    address[] public vaultList;

    /// @notice Single allocation within a strategy
    struct Allocation {
        address vault;          // YO vault address (ERC-4626)
        uint16 weightBps;       // Weight in basis points (e.g., 7000 = 70%)
        uint256 sharesHeld;     // yoTokens held for this allocation
        uint256 assetsDeposited; // Total underlying assets deposited (for profit calc)
    }

    /// @notice A savings goal with multi-vault strategy
    struct Goal {
        string name;
        uint256 targetAmount;       // Target in underlying asset terms (e.g., 3000e6 USDC)
        uint256 deadline;           // Unix timestamp
        uint8 riskLevel;            // 0 = Conservative, 1 = Balanced, 2 = Growth
        address depositAsset;       // The underlying asset (USDC, WETH, etc.)
        bool active;
        uint256 totalDeposited;     // Total underlying deposited across all allocations
        uint256 createdAt;
        Allocation[] allocations;
    }

    /// @notice goalId counter
    uint256 public nextGoalId;

    /// @notice user => goalId => Goal
    mapping(address => mapping(uint256 => Goal)) public goals;

    /// @notice user => list of their goal IDs
    mapping(address => uint256[]) public userGoalIds;

    // ─── EVENTS ──────────────────────────────────────────────

    event GoalCreated(
        address indexed user,
        uint256 indexed goalId,
        string name,
        uint256 targetAmount,
        uint256 deadline,
        uint8 riskLevel,
        address depositAsset
    );

    event StrategySet(
        address indexed user,
        uint256 indexed goalId,
        address[] vaults,
        uint16[] weights
    );

    event Deposited(
        address indexed user,
        uint256 indexed goalId,
        uint256 totalAssets,
        uint256[] sharesPerVault
    );

    event Withdrawn(
        address indexed user,
        uint256 indexed goalId,
        uint256 totalAssets,
        uint256 profit,
        uint256 fee,
        uint256 userReceived
    );

    event Rebalanced(
        address indexed user,
        uint256 indexed goalId
    );

    event VaultWhitelisted(address indexed vault, bool status);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event FeeUpdated(uint256 oldFee, uint256 newFee);

    // ─── CONSTRUCTOR ─────────────────────────────────────────

    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;

        // Whitelist YO vaults on Base mainnet
        _whitelistVault(0x0000000f2eB9f69274678c76222B35eEc7588a65); // yoUSD
        _whitelistVault(0x3a43aec53490cb9fa922847385d82fe25d0e9de7); // yoETH
        _whitelistVault(0xbCbc8cb4D1e8ED048a6276a5E94A3e952660BcbC); // yoBTC
    }

    // ─── GOAL MANAGEMENT ─────────────────────────────────────

    /// @notice Create a new savings goal
    /// @param name Human-readable goal name
    /// @param targetAmount Target savings amount in deposit asset units
    /// @param deadline Unix timestamp deadline
    /// @param riskLevel 0=Conservative, 1=Balanced, 2=Growth
    /// @param depositAsset The underlying ERC20 token (USDC, WETH, cbBTC)
    /// @param vaults Array of YO vault addresses for the strategy
    /// @param weights Array of weights in basis points (must sum to 10000)
    function createGoal(
        string calldata name,
        uint256 targetAmount,
        uint256 deadline,
        uint8 riskLevel,
        address depositAsset,
        address[] calldata vaults,
        uint16[] calldata weights
    ) external returns (uint256 goalId) {
        require(bytes(name).length > 0, "Empty name");
        require(targetAmount > 0, "Zero target");
        require(deadline > block.timestamp, "Past deadline");
        require(riskLevel <= 2, "Invalid risk level");
        require(depositAsset != address(0), "Invalid asset");
        require(vaults.length > 0 && vaults.length <= MAX_ALLOCATIONS, "Invalid vault count");
        require(vaults.length == weights.length, "Length mismatch");

        goalId = nextGoalId++;

        Goal storage goal = goals[msg.sender][goalId];
        goal.name = name;
        goal.targetAmount = targetAmount;
        goal.deadline = deadline;
        goal.riskLevel = riskLevel;
        goal.depositAsset = depositAsset;
        goal.active = true;
        goal.createdAt = block.timestamp;

        _setAllocations(goal, vaults, weights, depositAsset);

        userGoalIds[msg.sender].push(goalId);

        emit GoalCreated(msg.sender, goalId, name, targetAmount, deadline, riskLevel, depositAsset);
        emit StrategySet(msg.sender, goalId, vaults, weights);
    }

    /// @notice Deposit assets into a goal, split across strategy vaults
    /// @param goalId The goal to deposit into
    /// @param amount Total amount of underlying asset to deposit
    function deposit(uint256 goalId, uint256 amount) external nonReentrant {
        Goal storage goal = goals[msg.sender][goalId];
        require(goal.active, "Goal not active");
        require(amount > 0, "Zero amount");

        // Transfer assets from user to this contract
        IERC20(goal.depositAsset).safeTransferFrom(msg.sender, address(this), amount);

        uint256[] memory sharesReceived = new uint256[](goal.allocations.length);
        uint256 remaining = amount;

        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            
            // Calculate this allocation's share of the deposit
            uint256 allocAmount;
            if (i == goal.allocations.length - 1) {
                // Last allocation gets remainder to avoid dust
                allocAmount = remaining;
            } else {
                allocAmount = (amount * alloc.weightBps) / BPS_DENOMINATOR;
                remaining -= allocAmount;
            }

            if (allocAmount == 0) continue;

            // Approve vault to spend assets
            IERC20(goal.depositAsset).forceApprove(alloc.vault, allocAmount);

            // Deposit into YO vault, receive yoTokens
            uint256 shares = IERC4626(alloc.vault).deposit(allocAmount, address(this));
            
            alloc.sharesHeld += shares;
            alloc.assetsDeposited += allocAmount;
            sharesReceived[i] = shares;
        }

        goal.totalDeposited += amount;

        emit Deposited(msg.sender, goalId, amount, sharesReceived);
    }

    /// @notice Withdraw all assets from a goal, collecting 10% fee on profit
    /// @param goalId The goal to withdraw from
    function withdraw(uint256 goalId) external nonReentrant {
        Goal storage goal = goals[msg.sender][goalId];
        require(goal.active, "Goal not active");

        uint256 totalAssetsOut;
        uint256 totalProfit;
        uint256 totalFee;

        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            
            if (alloc.sharesHeld == 0) continue;

            // Redeem all yoTokens from this vault
            uint256 assetsReturned = IERC4626(alloc.vault).redeem(
                alloc.sharesHeld,
                address(this),  // assets come to this contract first
                address(this)
            );

            // Calculate profit for this allocation
            uint256 profit;
            if (assetsReturned > alloc.assetsDeposited) {
                profit = assetsReturned - alloc.assetsDeposited;
            }

            // Fee is 10% of profit only (principal is never touched)
            uint256 fee = (profit * FEE_BPS) / BPS_DENOMINATOR;

            totalAssetsOut += assetsReturned;
            totalProfit += profit;
            totalFee += fee;

            // Reset allocation state
            alloc.sharesHeld = 0;
            alloc.assetsDeposited = 0;
        }

        // Send fee to treasury (funds x402 API calls)
        if (totalFee > 0) {
            IERC20(goal.depositAsset).safeTransfer(treasury, totalFee);
            totalFeesCollected += totalFee;
        }

        // Send remaining assets to user
        uint256 userReceives = totalAssetsOut - totalFee;
        IERC20(goal.depositAsset).safeTransfer(msg.sender, userReceives);

        // Mark goal as inactive
        goal.active = false;
        goal.totalDeposited = 0;

        emit Withdrawn(msg.sender, goalId, totalAssetsOut, totalProfit, totalFee, userReceives);
    }

    /// @notice Partial withdrawal from a goal (percentage-based)
    /// @param goalId The goal to withdraw from
    /// @param percentBps Percentage to withdraw in basis points (e.g., 5000 = 50%)
    function withdrawPartial(uint256 goalId, uint16 percentBps) external nonReentrant {
        require(percentBps > 0 && percentBps <= BPS_DENOMINATOR, "Invalid percent");
        
        Goal storage goal = goals[msg.sender][goalId];
        require(goal.active, "Goal not active");

        uint256 totalAssetsOut;
        uint256 totalProfit;
        uint256 totalFee;

        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            if (alloc.sharesHeld == 0) continue;

            // Redeem proportional shares
            uint256 sharesToRedeem = (alloc.sharesHeld * percentBps) / BPS_DENOMINATOR;
            if (sharesToRedeem == 0) continue;

            uint256 assetsReturned = IERC4626(alloc.vault).redeem(
                sharesToRedeem, address(this), address(this)
            );

            // Proportional cost basis
            uint256 proportionalDeposited = (alloc.assetsDeposited * percentBps) / BPS_DENOMINATOR;
            uint256 profit;
            if (assetsReturned > proportionalDeposited) {
                profit = assetsReturned - proportionalDeposited;
            }

            uint256 fee = (profit * FEE_BPS) / BPS_DENOMINATOR;

            totalAssetsOut += assetsReturned;
            totalProfit += profit;
            totalFee += fee;

            alloc.sharesHeld -= sharesToRedeem;
            alloc.assetsDeposited -= proportionalDeposited;
        }

        if (totalFee > 0) {
            IERC20(goal.depositAsset).safeTransfer(treasury, totalFee);
            totalFeesCollected += totalFee;
        }

        uint256 userReceives = totalAssetsOut - totalFee;
        IERC20(goal.depositAsset).safeTransfer(msg.sender, userReceives);
        goal.totalDeposited -= (goal.totalDeposited * percentBps) / BPS_DENOMINATOR;

        emit Withdrawn(msg.sender, goalId, totalAssetsOut, totalProfit, totalFee, userReceives);
    }

    /// @notice Rebalance a goal's allocations to new weights
    /// @dev Redeems from over-weighted vaults, deposits into under-weighted ones
    /// @param goalId The goal to rebalance
    /// @param newVaults New vault addresses
    /// @param newWeights New weights in basis points
    function rebalance(
        uint256 goalId,
        address[] calldata newVaults,
        uint16[] calldata newWeights
    ) external nonReentrant {
        Goal storage goal = goals[msg.sender][goalId];
        require(goal.active, "Goal not active");

        // Step 1: Redeem everything from current allocations
        uint256 totalAssets;
        uint256 totalOrigDeposited;
        
        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            if (alloc.sharesHeld == 0) continue;

            uint256 assetsReturned = IERC4626(alloc.vault).redeem(
                alloc.sharesHeld, address(this), address(this)
            );
            totalAssets += assetsReturned;
            totalOrigDeposited += alloc.assetsDeposited;
        }

        // Step 2: Clear old allocations
        delete goal.allocations;

        // Step 3: Set new allocations
        _setAllocations(goal, newVaults, newWeights, goal.depositAsset);

        // Step 4: Re-deposit into new strategy
        uint256 remaining = totalAssets;
        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            
            uint256 allocAmount;
            if (i == goal.allocations.length - 1) {
                allocAmount = remaining;
            } else {
                allocAmount = (totalAssets * alloc.weightBps) / BPS_DENOMINATOR;
                remaining -= allocAmount;
            }

            if (allocAmount == 0) continue;

            IERC20(goal.depositAsset).forceApprove(alloc.vault, allocAmount);
            uint256 shares = IERC4626(alloc.vault).deposit(allocAmount, address(this));
            
            alloc.sharesHeld = shares;
            // Preserve original deposit basis for fair fee calculation
            alloc.assetsDeposited = (totalOrigDeposited * alloc.weightBps) / BPS_DENOMINATOR;
        }

        goal.totalDeposited = totalOrigDeposited; // Basis unchanged

        emit Rebalanced(msg.sender, goalId);
    }

    // ─── VIEW FUNCTIONS ──────────────────────────────────────

    /// @notice Get the current total value of a goal across all vault allocations
    function getGoalCurrentValue(address user, uint256 goalId) external view returns (uint256 totalValue) {
        Goal storage goal = goals[user][goalId];
        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            if (alloc.sharesHeld > 0) {
                totalValue += IERC4626(alloc.vault).convertToAssets(alloc.sharesHeld);
            }
        }
    }

    /// @notice Get the unrealized profit for a goal
    function getGoalProfit(address user, uint256 goalId) external view returns (uint256 profit) {
        Goal storage goal = goals[user][goalId];
        uint256 currentValue;
        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            if (alloc.sharesHeld > 0) {
                currentValue += IERC4626(alloc.vault).convertToAssets(alloc.sharesHeld);
            }
        }
        if (currentValue > goal.totalDeposited) {
            profit = currentValue - goal.totalDeposited;
        }
    }

    /// @notice Get the fee that would be charged on current profit
    function getGoalFeePreview(address user, uint256 goalId) external view returns (uint256 fee) {
        Goal storage goal = goals[user][goalId];
        uint256 currentValue;
        for (uint256 i = 0; i < goal.allocations.length; i++) {
            Allocation storage alloc = goal.allocations[i];
            if (alloc.sharesHeld > 0) {
                currentValue += IERC4626(alloc.vault).convertToAssets(alloc.sharesHeld);
            }
        }
        if (currentValue > goal.totalDeposited) {
            uint256 profit = currentValue - goal.totalDeposited;
            fee = (profit * FEE_BPS) / BPS_DENOMINATOR;
        }
    }

    /// @notice Get full goal details including all allocations
    function getGoalDetails(address user, uint256 goalId)
        external
        view
        returns (
            string memory name,
            uint256 targetAmount,
            uint256 deadline,
            uint8 riskLevel,
            address depositAsset,
            bool active,
            uint256 totalDeposited,
            uint256 createdAt,
            uint256 currentValue,
            uint256 allocationCount
        )
    {
        Goal storage goal = goals[user][goalId];
        name = goal.name;
        targetAmount = goal.targetAmount;
        deadline = goal.deadline;
        riskLevel = goal.riskLevel;
        depositAsset = goal.depositAsset;
        active = goal.active;
        totalDeposited = goal.totalDeposited;
        createdAt = goal.createdAt;
        allocationCount = goal.allocations.length;

        for (uint256 i = 0; i < goal.allocations.length; i++) {
            if (goal.allocations[i].sharesHeld > 0) {
                currentValue += IERC4626(goal.allocations[i].vault).convertToAssets(
                    goal.allocations[i].sharesHeld
                );
            }
        }
    }

    /// @notice Get allocation details for a specific goal
    function getGoalAllocation(address user, uint256 goalId, uint256 index)
        external
        view
        returns (
            address vault,
            uint16 weightBps,
            uint256 sharesHeld,
            uint256 assetsDeposited,
            uint256 currentValue
        )
    {
        Allocation storage alloc = goals[user][goalId].allocations[index];
        vault = alloc.vault;
        weightBps = alloc.weightBps;
        sharesHeld = alloc.sharesHeld;
        assetsDeposited = alloc.assetsDeposited;
        if (sharesHeld > 0) {
            currentValue = IERC4626(vault).convertToAssets(sharesHeld);
        }
    }

    /// @notice Get all goal IDs for a user
    function getUserGoalIds(address user) external view returns (uint256[] memory) {
        return userGoalIds[user];
    }

    /// @notice Get number of active goals for a user
    function getUserActiveGoalCount(address user) external view returns (uint256 count) {
        uint256[] memory ids = userGoalIds[user];
        for (uint256 i = 0; i < ids.length; i++) {
            if (goals[user][ids[i]].active) count++;
        }
    }

    /// @notice Get the list of whitelisted vaults
    function getWhitelistedVaults() external view returns (address[] memory) {
        return vaultList;
    }

    // ─── ADMIN ───────────────────────────────────────────────

    /// @notice Whitelist or remove a YO vault
    function setVaultWhitelist(address vault, bool status) external onlyOwner {
        if (status && !whitelistedVaults[vault]) {
            whitelistedVaults[vault] = true;
            vaultList.push(vault);
        } else if (!status) {
            whitelistedVaults[vault] = false;
            // Note: doesn't remove from vaultList array for gas efficiency
        }
        emit VaultWhitelisted(vault, status);
    }

    /// @notice Update treasury address
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    /// @notice Emergency: rescue tokens accidentally sent to contract
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    // ─── INTERNAL ────────────────────────────────────────────

    function _whitelistVault(address vault) internal {
        whitelistedVaults[vault] = true;
        vaultList.push(vault);
        emit VaultWhitelisted(vault, true);
    }

    function _setAllocations(
        Goal storage goal,
        address[] calldata vaults,
        uint16[] calldata weights,
        address depositAsset
    ) internal {
        uint256 totalWeight;
        for (uint256 i = 0; i < vaults.length; i++) {
            require(whitelistedVaults[vaults[i]], "Vault not whitelisted");
            require(weights[i] > 0, "Zero weight");
            
            // Verify the vault's underlying asset matches the goal's deposit asset
            require(IERC4626(vaults[i]).asset() == depositAsset, "Asset mismatch");

            goal.allocations.push(Allocation({
                vault: vaults[i],
                weightBps: weights[i],
                sharesHeld: 0,
                assetsDeposited: 0
            }));

            totalWeight += weights[i];
        }
        require(totalWeight == BPS_DENOMINATOR, "Weights must sum to 10000");
    }
}
