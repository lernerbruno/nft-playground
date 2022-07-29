const Tijolo = artifacts.require("./Tijolo.sol");

module.exports = function (deployer) {
  deployer.deploy(Tijolo);
};
