export const YOGOALS_ABI = [
  // ─── WRITE ───
  {
    name: "createGoal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "riskLevel", type: "uint8" },
      { name: "depositAsset", type: "address" },
      { name: "vaults", type: "address[]" },
      { name: "weights", type: "uint16[]" },
    ],
    outputs: [{ name: "goalId", type: "uint256" }],
  },
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdrawPartial",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "percentBps", type: "uint16" },
    ],
    outputs: [],
  },
  {
    name: "rebalance",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "newVaults", type: "address[]" },
      { name: "newWeights", type: "uint16[]" },
    ],
    outputs: [],
  },
  // ─── READ ───
  {
    name: "getGoalCurrentValue",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "goalId", type: "uint256" },
    ],
    outputs: [{ name: "totalValue", type: "uint256" }],
  },
  {
    name: "getGoalProfit",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "goalId", type: "uint256" },
    ],
    outputs: [{ name: "profit", type: "uint256" }],
  },
  {
    name: "getGoalFeePreview",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "goalId", type: "uint256" },
    ],
    outputs: [{ name: "fee", type: "uint256" }],
  },
  {
    name: "getGoalDetails",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "goalId", type: "uint256" },
    ],
    outputs: [
      { name: "name", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "riskLevel", type: "uint8" },
      { name: "depositAsset", type: "address" },
      { name: "active", type: "bool" },
      { name: "totalDeposited", type: "uint256" },
      { name: "createdAt", type: "uint256" },
      { name: "currentValue", type: "uint256" },
      { name: "allocationCount", type: "uint256" },
    ],
  },
  {
    name: "getGoalAllocation",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "goalId", type: "uint256" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      { name: "vault", type: "address" },
      { name: "weightBps", type: "uint16" },
      { name: "sharesHeld", type: "uint256" },
      { name: "assetsDeposited", type: "uint256" },
      { name: "currentValue", type: "uint256" },
    ],
  },
  {
    name: "getUserGoalIds",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getUserActiveGoalCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "count", type: "uint256" }],
  },
  {
    name: "getWhitelistedVaults",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "FEE_BPS",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "treasury",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "totalFeesCollected",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "nextGoalId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // ─── EVENTS ───
  {
    name: "GoalCreated",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "goalId", type: "uint256", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "targetAmount", type: "uint256", indexed: false },
      { name: "deadline", type: "uint256", indexed: false },
      { name: "riskLevel", type: "uint8", indexed: false },
      { name: "depositAsset", type: "address", indexed: false },
    ],
  },
  {
    name: "Deposited",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "goalId", type: "uint256", indexed: true },
      { name: "totalAssets", type: "uint256", indexed: false },
      { name: "sharesPerVault", type: "uint256[]", indexed: false },
    ],
  },
  {
    name: "Withdrawn",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "goalId", type: "uint256", indexed: true },
      { name: "totalAssets", type: "uint256", indexed: false },
      { name: "profit", type: "uint256", indexed: false },
      { name: "fee", type: "uint256", indexed: false },
      { name: "userReceived", type: "uint256", indexed: false },
    ],
  },
  {
    name: "Rebalanced",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "goalId", type: "uint256", indexed: true },
    ],
  },
] as const;

// Standard ERC20 approve ABI
export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;
