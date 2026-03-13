const hre = require("hardhat");

async function main() {
  const treasury = process.env.TREASURY_ADDRESS;
  if (!treasury) throw new Error("Set TREASURY_ADDRESS in .env");

  console.log("Deploying YoGoals to Base mainnet...");
  console.log("Treasury:", treasury);

  const YoGoals = await hre.ethers.getContractFactory("YoGoals");
  const contract = await YoGoals.deploy(treasury);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("YoGoals deployed to:", address);

  // Verify whitelisted vaults
  const vaults = await contract.getWhitelistedVaults();
  console.log("Whitelisted vaults:", vaults);

  console.log("\n─── NEXT STEPS ───");
  console.log(`1. Set NEXT_PUBLIC_YOGOALS_CONTRACT=${address} in .env`);
  console.log(`2. Verify: npx hardhat verify --network base ${address} ${treasury}`);
  console.log("3. Fund treasury with USDC for x402 API calls");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
