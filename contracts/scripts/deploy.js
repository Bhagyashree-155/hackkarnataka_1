const hre = require("hardhat");

async function main() {
  console.log("Deploying LoanContract...");

  const LoanContract = await hre.ethers.getContractFactory("LoanContract");
  const loanContract = await LoanContract.deploy();

  await loanContract.waitForDeployment();

  const address = await loanContract.getAddress();
  console.log("LoanContract deployed to:", address);
  console.log("\nSave this address to use in your frontend!");
  console.log("Contract Address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

