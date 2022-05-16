const Monetum = artifacts.require("Monetum");
const BN = web3.utils.BN;

const initialSupply = new BN(381536000).mul((new BN(10)).pow(new BN(18)));

console.log("initialSupply");
console.log(initialSupply.toString());
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
    
    assert.ok(balance.eq(initialSupply));
    assert.ok(balanceWallet1.eq(new BN(0)));
    assert.ok(balanceWallet2.eq(new BN(0)));
    assert.ok(balanceWallet3.eq(new BN(0)));
    assert.ok(balanceWallet4.eq(new BN(0)));
    assert.ok(balanceWallet5.eq(new BN(0)));
    assert.ok(balanceWallet6.eq(new BN(0)));
    assert.ok(balanceWallet7.eq(new BN(0)));
    assert.ok(balanceWallet8.eq(new BN(0)));
    assert.ok(balanceWallet9.eq(new BN(0)));
 
    assert.equal(name, "Monetum");
    assert.equal(symbol, "MOM");
    assert.equal(decimal, 18);
  });





  it("The creator can correctly burn some  tokens", async () => {
    const instance  = await Monetum.deployed();
    const amountBurn = new BN(1000000000000000); //from 16 decimals it will overflow due to Javascript
    const impactOfBurn= await instance.burn(amountBurn);
    const balanceafterBurn = await instance.balanceOf(accounts[0]);
    console.log(balanceafterBurn.toString());
    assert.ok(balanceafterBurn.eq(initialSupply.sub(amountBurn)));
    const supplyAfterBurn = await instance.totalSupply();
    assert.ok(supplyAfterBurn.eq(initialSupply.sub(amountBurn)));
    });

    it("Correct transfer of tokens", async () => {
      const instance  = await Monetum.deployed();
      const balanceAliceBefore = await instance.balanceOf(accounts[1]);
      assert.ok(balanceAliceBefore.eq(new BN(0)));
      const balaneMinterBefore = await instance.balanceOf(accounts[0]);

      const amountToTranfer = new BN(1000000000000000); //from 16 decimals it will overflow due to limits in Javascripts
      const transferToAlice= await instance.transfer(accounts[1],amountToTranfer, {from: accounts[0]});
      const balanceAliceAfter = await instance.balanceOf(accounts[1]);
      const balanceMinterAfter = await instance.balanceOf(accounts[0]);
      assert.ok(balanceAliceAfter.eq(amountToTranfer));
      assert.ok(balanceMinterAfter.eq(balaneMinterBefore.sub(amountToTranfer)));
      });

      it("Cannot transfer more amount than balance", async () => {
        const instance  = await Monetum.deployed();
        const balanceAliceBefore = await instance.balanceOf(accounts[1]);
        const balanceMinterBefore = await instance.balanceOf(accounts[0]);
  
        const amountToTranfer = balanceAliceBefore.add(new BN(1)); //from 16 decimals it will overflow due to limits in Javascripts
        try{
          const transfer= await instance.transfer(accounts[0],amountToTranfer, {from: accounts[1]});
        }
        catch(err){
          console.log(err.reason);
        }
        const balanceAliceAfter = await instance.balanceOf(accounts[1]);
        const balanceMinterAfter = await instance.balanceOf(accounts[0]);
        assert.ok(balanceAliceAfter.eq(balanceAliceBefore));
        assert.ok(balanceMinterAfter.eq(balanceMinterBefore));
        });



      it("Address wihout tokens cannot mint or transfer tokens", async () => {
        const instanceContract  = await Monetum.deployed();

        let balance = await instanceContract.balanceOf(accounts[9]);
        assert.ok(balance.eq(new BN(0)));

        const amountToTranfer = new BN(1000); //from 16 decimals it will overflow due to limits in Javascripts
        try{
          //must fail
         await instanceContract.transfer(accounts[8],amountToTranfer, {from: accounts[9]});
       } catch (error) { 
         console.log(error.reason);
       }
        balance = await instanceContract.balanceOf(accounts[8]);
        assert.ok(balance.eq(new BN(0)));

        });

      it("Correct transfer of tokens from Alice to Bob", async () => {
        const instanceContract  = await Monetum.deployed();
        const sumToTransfer = new BN(1000); //from 16 decimals it will overflow due to limitations on the Javascript
        const transferAliceBob = await instanceContract.transfer(accounts[2],sumToTransfer, {from: accounts[1]});
        const balanceAlice = await instanceContract.balanceOf(accounts[1]);
        const balanceBob = await instanceContract.balanceOf(accounts[2]);
        const balanceMsgSender = await instanceContract.balanceOf(accounts[0]);
        assert.ok(balanceAlice.eq(new BN(1000000000000000).sub( sumToTransfer ))); //balance from previous transfer from
        assert.ok(balanceBob.eq(sumToTransfer));
        console.log(balanceBob.toString());

        });

      it("Increase / Decrease  Allowance Alice", async () => {
        const instanceContract  = await Monetum.deployed();
        let allowance = await instanceContract.allowance(accounts[0],accounts[1]);
        assert.ok(allowance.eq(new BN(0)));
        const sumToIncrease = new BN(200); //from 16 decimals it will overflow
        const increaseAllowance = await instanceContract.increaseAllowance(accounts[1],sumToIncrease);
        allowance = await instanceContract.allowance(accounts[0],accounts[1]);
        assert.ok(allowance.eq(sumToIncrease));

        await instanceContract.decreaseAllowance(accounts[1],allowance);
        allowance = await instanceContract.allowance(accounts[0],accounts[1]);
        assert.ok(allowance.eq(new BN(0)));

      });

      it("Bob is able to spend approved tokens by Alice", async () => {
        let instanceContractBob  = await Monetum.deployed();
        const amountAllowance = new BN(100); //from 16 decimals it will overflow

        //Alice approve 100 to Bob
        await instanceContractBob.approve(accounts[2],amountAllowance,{from: accounts[1]});
        
        let allowance = await instanceContractBob.allowance(accounts[1],accounts[2]);
        assert.ok(allowance.eq(amountAllowance));

        let supplyBefore = await instanceContractBob.totalSupply();
        let balanceAliceBefore = await instanceContractBob.balanceOf(accounts[1]);
        let balanceBobBefore  = await instanceContractBob.balanceOf(accounts[2]);
        //Bob spends 100 from Alice accounts
        await instanceContractBob.transferFrom(accounts[1],accounts[2],amountAllowance,{from: accounts[2]});
        
        let balanceAliceAfter = await instanceContractBob.balanceOf(accounts[1]);
        let balanceBobAfter = await instanceContractBob.balanceOf(accounts[2]);
        allowance = await instanceContractBob.allowance(accounts[1],accounts[2]);

        assert.ok(balanceAliceAfter.eq(balanceAliceBefore.sub(amountAllowance)));
        assert.ok(balanceBobAfter.eq(balanceBobBefore.add(amountAllowance)));
        assert.ok(allowance.eq(new BN(0)));


        });

      it("Bob is able to burn its own tokens", async () => {
       let instanceContractBob  = await Monetum.deployed();
       let amountToBurn = new BN(200);
       let supplyBeforeBurn = await instanceContractBob.totalSupply();
       let balanceBobBeforeBurn = await instanceContractBob.balanceOf(accounts[2]);
       console.log(balanceBobBeforeBurn.toString());
       const burnToBob = await instanceContractBob.burn(amountToBurn,{from: accounts[2]});

       let supplyAfterBurn = await instanceContractBob.totalSupply();
       assert.ok(supplyAfterBurn.eq(supplyBeforeBurn.sub(amountToBurn)));
       let balanceBobAfterBurn = await instanceContractBob.balanceOf(accounts[2]);
       
       assert.ok(balanceBobAfterBurn.eq(balanceBobBeforeBurn.sub(amountToBurn)));
       });

       it("Bob should not be able to burn Alics's tokens without allowance", async () => {

         let instanceContract  = await Monetum.deployed();
         let balanceAliceBeforeBurn = await instanceContract.balanceOf(accounts[1]);
         let supplyBeforeBurn = await instanceContract.totalSupply();
         const amountBurn = new BN(10); //from 16 decimals it will overflow


         //const approvedAllowance = await instanceContractBob.approve(accounts[2],approvedAllowance,{from: accounts[2]});
         try {
         await instanceContract.burnFrom(accounts[1],amountBurn,{from: accounts[2]});
       } catch (error) { "Transaction Reversed"
         return true
       }
         const balanceAliceAfterBurn = await instanceContract.balanceOf(accounts[1]);
         let supplyAfterBurn = await instanceContract.totalSupply();
         assert.ok(balanceAliceAfterBurn.eq(balanceAliceBeforeBurn));
         assert.ok(supplyAfterBurn.eq(supplyBeforeBurn));
         });       


       it("Bob is able to burn approved tokens by Alice", async () => {
        let instanceContractBob  = await Monetum.deployed();
        const amountAllowance = new BN(100); //from 16 decimals it will overflow

        //Alice approve 100 to Bob
        const approveBobAllowance = await instanceContractBob.approve(accounts[2],amountAllowance,{from: accounts[1]});
        
        let allowance = await instanceContractBob.allowance(accounts[1],accounts[2]);
        assert.ok(allowance.eq(amountAllowance));

        let supplyBeforeBurn = await instanceContractBob.totalSupply();
        let balanceAliceBeforeBurn = await instanceContractBob.balanceOf(accounts[1]);
        console.log("balanceAliceBeforeBurn");
        console.log(balanceAliceBeforeBurn.toString());

        //Bor burns 100 from Alice accounts
        const burnToBob = await instanceContractBob.burnFrom(accounts[1],amountAllowance,{from: accounts[2]});
        
        
        const balanceAliceAfterBurn = await instanceContractBob.balanceOf(accounts[1]);
        console.log("balanceAliceAfterBurn");
        console.log(balanceAliceAfterBurn.toString());

        let supplyAfterBurn = await instanceContractBob.totalSupply();
        allowance = await instanceContractBob.allowance(accounts[1],accounts[2]);

        assert.ok(balanceAliceAfterBurn.eq(balanceAliceBeforeBurn.sub(amountAllowance)));
        assert.ok(supplyAfterBurn.eq(supplyBeforeBurn.sub(amountAllowance)));
        assert.ok(allowance.eq(new BN(0)));


        });

        it("Bob is not able to burn more than approved tokens by Alice", async () => {
          let instanceContractBob  = await Monetum.deployed();
          const amountAllowance = new BN(100); //from 16 decimals it will overflow
  
          //Alice approve 100 to Bob
          const approveBobAllowance = await instanceContractBob.approve(accounts[2],amountAllowance,{from: accounts[1]});
          
          let allowance = await instanceContractBob.allowance(accounts[1],accounts[2]);
          assert.ok(allowance.eq(amountAllowance));
  
          let supplyBeforeBurn = await instanceContractBob.totalSupply();
          let balanceAliceBeforeBurn = await instanceContractBob.balanceOf(accounts[1]);
          console.log("balanceAliceBeforeBurn");
          console.log(balanceAliceBeforeBurn.toString());
  
          //Bor burns 101 from Alice accounts
          try{
            await instanceContractBob.burnFrom(accounts[1],amountAllowance.add(new BN(1)),{from: accounts[2]});
          }catch(err){
            console.log(err.reason);
          }          
          
          const balanceAliceAfterBurn = await instanceContractBob.balanceOf(accounts[1]);
  
          let supplyAfterBurn = await instanceContractBob.totalSupply();
  
          assert.ok(balanceAliceAfterBurn.eq(balanceAliceBeforeBurn));
          assert.ok(supplyAfterBurn.eq(supplyBeforeBurn));
  
  
          });




       it("Bob should not be able to burn more than his own balance", async () => {
        let instanceContractBob  = await Monetum.deployed();

        let amountToTranfer = new BN(1000000);
        //transfer some more tokens to Bob
        const transferToBob= await instanceContractBob.transfer(accounts[2],amountToTranfer, {from: accounts[0]});

        //amount to burn set as Bob's balance + 10
        const balanceBobBeforeBurn = await instanceContractBob.balanceOf(accounts[2]);
        const amountToBurn = balanceBobBeforeBurn.add(new BN(10));
        
        
        try {
          //it must fail
        await instanceContractBob.burn(amountToBurn,{from: accounts[2]});
      } catch (error) { "Transaction Reversed"
        return true
      }
        //const balanceBob = await instanceContractBob.balanceOf(accounts[2]);
        //assert.fail();

        //amount to burn set as Bob's balance + 10
        const balanceBobAfterBurn = await instanceContractBob.balanceOf(accounts[2]);
        assert.ok(balanceBobAfterBurn.eq(balanceBobBeforeBurn));

        });
});


//var Monetum = artifacts.require("Monetum");
