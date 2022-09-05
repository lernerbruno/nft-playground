async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  
  // Get the ContractFactories and Signers
  const SogoNFT = await ethers.getContractFactory("SogoNFT");
  const Sogo = await ethers.getContractFactory("Sogo");
  const OrganizationFactory = await ethers.getContractFactory("OrganizationFactory");
  
  // Deploy contracts
  const sogo = await Sogo.deploy(1);
  const sogoNFT = await SogoNFT.deploy();
  const organizationFactory = await OrganizationFactory.deploy();
  
  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(sogo , "Sogo");
  saveFrontendFiles(sogoNFT , "SogoNFT");
  saveFrontendFiles(organizationFactory , "OrganizationFactory");

  console.log("SogoNFT address: ", sogoNFT.address);
  console.log("Sogo address: ", sogo.address);
  console.log("Organization Factory address: ", organizationFactory.address);
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });