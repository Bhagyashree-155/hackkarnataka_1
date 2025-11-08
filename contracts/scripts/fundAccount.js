const hre = require("hardhat");

async function main() {
  // Get the first test account (it has 10,000 ETH)
  const [signer] = await hre.ethers.getSigners();
  
  // Get the account address to fund from command line argument or use a default
  const recipientAddress = process.argv[2];
  
  if (!recipientAddress) {
    console.log("Usage: npx hardhat run scripts/fundAccount.js --network localhost <RECIPIENT_ADDRESS>");
    console.log("\nExample:");
    console.log("npx hardhat run scripts/fundAccount.js --network localhost 0x1234567890123456789012345678901234567890");
    console.log("\nOr fund the deployer account:");
    console.log(`npx hardhat run scripts/fundAccount.js --network localhost ${signer.address}`);
    process.exit(1);
  }

  console.log(`Funding account: ${recipientAddress}`);
  console.log(`From account: ${signer.address}`);
  
  const balanceBefore = await hre.ethers.provider.getBalance(recipientAddress);
  console.log(`Balance before: ${hre.ethers.formatEther(balanceBefore)} ETH`);

  // Send 100 ETH to the recipient
  const amount = hre.ethers.parseEther("100");
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

