const hre = require("hardhat");

// Hardhat's default test accounts with their private keys
const TEST_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389ac9f411256d1da3d4c38496cfb5c71230"
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
  },
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
  }
];

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Hardhat Test Accounts (Pre-funded with 10,000 ETH each)");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  TEST_ACCOUNTS.forEach((account, index) => {
    console.log(`Account ${index + 1}:`);
    console.log(`  Address:    ${account.address}`);
    console.log(`  Private Key: ${account.privateKey}`);
    console.log("");
  });
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("💡 How to Import into MetaMask:");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("1. Open MetaMask");
  console.log("2. Click the account icon (top right)");
  console.log("3. Select 'Import Account'");
  console.log("4. Paste one of the private keys from above");
  console.log("5. The account will have 10,000 ETH on Hardhat Local network");
  console.log("");
  console.log("⚠️  IMPORTANT: These are test accounts for development only!");
  console.log("   Never use these private keys on mainnet or share them publicly.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

