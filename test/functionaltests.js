const Monetum = artifacts.require("Monetum");

//* @dev
//These tesst operate on the development network Ganache with provide 10 addresses (accounts)-
//They will not work with fewer addresses
//*
contract(" Correct Running of the contract", async accounts => {
  it("Correct minting of the token from the creator address, the total supply of tokens is in possession of the creator's address", async () => {
    const instance = await Monetum.deployed();
    const name = await instance.name();
    const symbol = await instance.symbol();
    const decimal = await instance.decimals();
    const balance = await instance.balanceOf(accounts[0]);
    const balanceWallet1 = await instance.balanceOf(accounts[1]);
    const balanceWallet2 = await instance.balanceOf(accounts[2]);
    const balanceWallet3 = await instance.balanceOf(accounts[3]);
    const balanceWallet4 = await instance.balanceOf(accounts[4]);
    const balanceWallet5 = await instance.balanceOf(accounts[5]);
    const balanceWallet6 = await instance.balanceOf(accounts[6]);
    const balanceWallet7 = await instance.balanceOf(accounts[7]);
    const balanceWallet8 = await instance.balanceOf(accounts[8]);
    const balanceWallet9 = await instance.balanceOf(accounts[9]);
    console.log(accounts[0]);
    console.log(accounts[1]);
    console.log(accounts[2]);
    console.log(accounts[3]);
    console.log(accounts[4]);
    console.log(accounts[5]);
    console.log(accounts[6]);
    console.log(accounts[7]);
    console.log(accounts[8]);
    console.log(accounts[9]);
    assert.equal(balance.valueOf(),381536000 *10 **18);
    assert.equal(balanceWallet1.valueOf(),0);
    assert.equal(balanceWallet2.valueOf(),0);
    assert.equal(balanceWallet3.valueOf(),0);
    assert.equal(balanceWallet4.valueOf(),0);
    assert.equal(balanceWallet5.valueOf(),0);
    assert.equal(balanceWallet6.valueOf(),0);
    assert.equal(balanceWallet7.valueOf(),0);
    assert.equal(balanceWallet8.valueOf(),0);
    assert.equal(balanceWallet9.valueOf(),0);
    assert.equal(name, "Monetum");
    assert.equal(symbol, "MOM");
    assert.equal(decimal, 18);
  });

  it("The creator can correctly burn some  tokens", async () => {
    const instancetobeBurned  = await Monetum.deployed();
    const amountBurn = 1000000000000000; //from 16 decimals it will overflow due to Javascript
    const impactOfBurn= await instancetobeBurned.burn(amountBurn);
    const balanceafterBurn = await instancetobeBurned.balanceOf(accounts[0]);
    assert.equal(balanceafterBurn.valueOf(),((381536000 *10 **18)-amountBurn));
    });

    it("Correct transfer of tokens by minter", async () => {
      const instanceContract  = await Monetum.deployed();
      const amountToTranfer = 1000000000000000; //from 16 decimals it will overflow due to limits in Javascripts
      const transferToAlice= await instanceContract.transfer(accounts[1],amountToTranfer, {from: accounts[0]});
      const balanceAlice = await instanceContract.balanceOf(accounts[1]);
      const balanceMsgSender = await instanceContract.balanceOf(accounts[0]);
      assert.equal(balanceAlice,amountToTranfer);
      assert.equal(balanceMsgSender.valueOf(),((381536000 *10 **18)-(1000000000000000 + amountToTranfer)));
      });

      it("Address wihout tokens cannot mint or transfer tokens", async () => {
        const instanceContract  = await Monetum.deployed();
        const amountToTranfer = 1000; //from 16 decimals it will overflow due to limits in Javascripts
        try{
         await instanceContract.transfer(accounts[1],amountToTranfer, {from: accounts[9]});
       } catch (error) { "Transaction Reversed"
         return true
       }
        const balance = await instanceContract.balanceOf(accounts[8]);
        const balanceAlice = await instanceContract.balanceOf(accounts[1]);
        assert.equal(balance,0);
          assert.equal(balanceAlice,1000000000000000);
        });

      it("Correct transfer of tokens from Alice to Bob", async () => {
        const instanceContract  = await Monetum.deployed();
        const sumToTransfer = 10; //from 16 decimals it will overflow due to limitations on the Javascript
        const transferAliceBob = await instanceContract.transfer(accounts[2],sumToTransfer, {from: accounts[1]});
        const balanceAlice = await instanceContract.balanceOf(accounts[1]);
        const balanceBob = await instanceContract.balanceOf(accounts[2]);
        const balanceMsgSender = await instanceContract.balanceOf(accounts[0]);
        assert.equal(balanceAlice,1000000000000000 - sumToTransfer); //balance from previous transfer from
        assert.equal(balanceBob,sumToTransfer);
        assert.equal(balanceMsgSender.valueOf(),((381536000 *10 **18)-(1000000000000000+1000000000000000)));
        });

        it("Increase  Allowance Alice", async () => {
          const instanceContract  = await Monetum.deployed();
          const sumToIncrease = 200; //from 16 decimals it will overflow
          const increaseAllowance = await instanceContract.increaseAllowance(accounts[1],sumToIncrease);
          const boolApprove = await instanceContract.approve(accounts[1],sumToIncrease);
          });

      it("Bob is able to burn its own tokens", async () => {
      let instanceContractBob  = await Monetum.deployed();
       const amountAllowance = 10; //from 16 decimals it will overflow
       const approveBobAllowance = await instanceContractBob.approve(accounts[2],amountAllowance,{from: accounts[2]});
       const burnToBob = await instanceContractBob.burnFrom(accounts[2],amountAllowance,{from: accounts[2]});
       const balanceBob = await instanceContractBob.balanceOf(accounts[2]);
       assert.equal(balanceBob,0);
       });

       it("Bob should not be able to burn Alics's tokens", async () => {
       let instanceContract  = await Monetum.deployed();
        const amountAllowance = 10; //from 16 decimals it will overflow
        //const approvedAllowance = await instanceContractBob.approve(accounts[2],approvedAllowance,{from: accounts[2]});
        try {
        await instanceContract.burnFrom(accounts[1],amountAllowance,{from: accounts[2]});
      } catch (error) { "Transaction Reversed"
        return true
      }
        const balanceAlice = await instanceContract.balanceOf(accounts[1]);
        assert.equal(balanceAlice,1000000000000000 - 10);
        });

       it("Bob should not be  able to burn his more than his own tokens in his account", async () => {
       let instanceContractBob  = await Monetum.deployed();
       const amountToTranfer = 10;
        const transferToBob= await instanceContractBob.transfer(accounts[2],amountToTranfer, {from: accounts[0]});
        const amountAllowance = 12; //from 16 decimals it will overflow
        const approveBobAllowance = await instanceContractBob.approve(accounts[2],amountAllowance,{from: accounts[2]});
        try {
        await instanceContractBob.burnFrom(accounts[2],amountAllowance,{from: accounts[2]});
      } catch (error) { "Transaction Reversed"
        return true
      }
        //const balanceBob = await instanceContractBob.balanceOf(accounts[2]);
        //assert.fail();
        });
});


//var Monetum = artifacts.require("Monetum");
