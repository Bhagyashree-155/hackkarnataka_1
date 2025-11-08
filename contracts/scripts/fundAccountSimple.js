const hre = require("hardhat");

async function main() {
  // Get the first test account (it has 10,000 ETH)
  const [signer] = await hre.ethers.getSigners();
  
  // Default test account addresses - you can modify this
  const recipientAddress = process.env.RECIPIENT_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  console.log(`Funding account: ${recipientAddress}`);
  console.log(`From account: ${signer.address}`);
  
  try {
    const balanceBefore = await hre.ethers.provider.getBalance(recipientAddress);
    console.log(`Balance before: ${hre.ethers.formatEther(balanceBefore)} ETH`);

    // Send 100 ETH to the recipient
    const amount = hre.ethers.parseEther("100");
    console.log(`Sending ${hre.ethers.formatEther(amount)} ETH...`);
    
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: amount,
    });

    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    
    const balanceAfter = await hre.ethers.provider.getBalance(recipientAddress);
    console.log(`Balance after: ${hre.ethers.formatEther(balanceAfter)} ETH`);
    console.log("\n✅ Account funded successfully!");
  } catch (error) {
    console.error("Error funding account:", error.message);
    console.log("\n⚠️  Make sure:");
    console.log("1. Hardhat node is running on http://127.0.0.1:8545");
    console.log("2. The node is mining blocks (not stuck at block 0)");
    console.log("3. You're using the correct network (localhost)");
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

