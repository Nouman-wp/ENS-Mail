const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ENSMail Subdomain Registrar...");

  // Sepolia ENS Registry address
  const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  
  // Sepolia Public Resolver address
  const PUBLIC_RESOLVER = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
  
  // mail.eth node hash (you would need to own this domain or use a test domain)
  // For testing, you might want to use a domain you own
  const PARENT_NODE = ethers.utils.namehash("mail.eth");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ENSMailSubdomainRegistrar = await ethers.getContractFactory("ENSMailSubdomainRegistrar");
  const registrar = await ENSMailSubdomainRegistrar.deploy(
    ENS_REGISTRY,
    PUBLIC_RESOLVER,
    PARENT_NODE
  );

  await registrar.deployed();

  console.log("ENSMailSubdomainRegistrar deployed to:", registrar.address);
  console.log("Constructor args:", [ENS_REGISTRY, PUBLIC_RESOLVER, PARENT_NODE]);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: registrar.address,
    ensRegistry: ENS_REGISTRY,
    resolver: PUBLIC_RESOLVER,
    parentNode: PARENT_NODE,
    deployer: deployer.address,
    blockNumber: registrar.deployTransaction.blockNumber,
    transactionHash: registrar.deployTransaction.hash,
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for a few confirmations before verification
  console.log("Waiting for confirmations...");
  await registrar.deployTransaction.wait(5);

  console.log("\nTo verify the contract, run:");
  console.log(`npx hardhat verify --network sepolia ${registrar.address} "${ENS_REGISTRY}" "${PUBLIC_RESOLVER}" "${PARENT_NODE}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
