# MonetumRepo
Code for Monetum Audit
## Getting started - Install Truffle 
> npm install truffle -g


## Preparation of project folder:
```
$ git clone your <https:your-git-repository>
$ cd <git-repository>
```
### Preparation of compile the files 
```
$ truffle compile
```

### Ethereum Client start with GIU
 Download Ganache for a visual blockchain to to
 
https://www.trufflesuite.com/ganache and 
Open the installation on your machine 

### Ethereum Client start from terminal (instead of GUI)
```
$ npm install --save-dev ganache-cli
npx ganache-cli --deterministic
```

### Migration to the local blockchain 
```
$ truffle migrate
```

### Run the tests 
```
truffle test
```
