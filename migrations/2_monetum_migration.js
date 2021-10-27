const Monetum = artifacts.require("Monetum");

module.exports = async function (deployer) {
  await deployer.deploy(Monetum);
};
