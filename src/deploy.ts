const hre = require("hardhat");

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();

  const factory = await hre.ethers.getContractFactory("PollingApp", deployer);
  const contract = await factory.deploy();

  await contract.waitForDeployment();

  console.log("App deployed to >>", await contract.getAddress());
};

main();
