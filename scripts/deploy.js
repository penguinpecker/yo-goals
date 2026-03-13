const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying YoGoals...");
  console.log("Deployer:", deployer.address);

  const YoGoals = await hre.ethers.getContractFactory("YoGoals");
  const contract = await YoGoals.deploy(deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("YoGoals deployed to:", address);
  console.log(`\nSet: NEXT_PUBLIC_YOGOALS_CONTRACT=${address}`);
  console.log(`Verify: npx hardhat verify --network base ${address} ${deployer.address}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
