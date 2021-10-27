const Monetum = artifacts.require("./Monetum.sol");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(Monetum);
};
//** code to interact with the deployment shell directly
//module.exports = async function (deployer) {
  //const _name = "Monetum";
//  const _symbol = "MOM";
//const _decimals =18;
//  await deployer.deploy(StandardToken,_name, _symbol,_decimal);
 //};
