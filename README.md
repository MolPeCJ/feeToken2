### Description

This repository contains an example of an erc-20 token with a fee charged  
for using the transfer function. The fee in the form of tokens goes to  
the wallet specified by the owner.  
The classic implementation of the token has been changed, all added  
functions are commented to improve understanding of their work.  

***

### Instalation

bash  
```yarn install```

### Usage

For further work, you will need to install in this project all all the necessary dependencies,  
which are listed in the 'package.json' file (for example, coverage (```yarn add coverage```))

### Compilation

```yarn hardhat compile```

### Run tests and coverage 

```yarn hardhat coverage```

### Deploying contract

```npx hardhat run scripts/01_deploy_FeeToken.js``` 
--network `<your network>`

### Verify a contract

```npx hardhat run scripts/02_verify_FeeToken.js``` 
--network `<your network>`