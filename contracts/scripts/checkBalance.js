const hre = require("hardhat");

async function main() {
  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  console.log("Checking balance for:", address);
  console.log("Network: localhost");
  console.log("");
  
  try {
    const balance = await hre.ethers.provider.getBalance(address);
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    
    console.log(`Current block number: ${blockNumber}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("");
    
    if (blockNumber === 0) {
      console.log("⚠️  WARNING: Node is at block 0!");
      console.log("The Hardhat node needs to mine blocks.");
      console.log("Try sending a transaction to trigger block mining.");
    }
    
    if (balance === 0n) {
      console.log("⚠️  Account has 0 ETH. Funding account...");
      const [signer] = await hre.ethers.getSigners();
      const tx = await signer.sendTransaction({
        to: address,
        value: hre.ethers.parseEther("100"),
      });
      await tx.wait();
      const newBalance = await hre.ethers.provider.getBalance(address);
      console.log(`✅ Account funded! New balance: ${hre.ethers.formatEther(newBalance)} ETH`);
    } else {
      console.log("✅ Account has ETH!");
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.log("\n⚠️  Make sure:");
    console.log("1. Hardhat node is running: npx hardhat node");
    console.log("2. You're using --network localhost");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

