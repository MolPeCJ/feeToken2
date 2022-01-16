const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  ethers: {
    BigNumber,
  },
} = require("hardhat");

describe('feeTokenTest', () => {
  beforeEach(async () => {
    [deployer, ownerTokens, wallet, addr1, addr2] = await ethers.getSigners();
    const feeTokenInstance = await ethers.getContractFactory('FeeToken');
    feeToken = await feeTokenInstance.deploy(ownerTokens.address, wallet.address, 
    process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL);
  });

  it('should transfer', async () => {
    await feeToken.connect(ownerTokens).transfer(addr1.address, 100000);
    await feeToken.connect(addr1).transfer(addr2.address, 10000);

    const totalSupply = await BigNumber.from("12884901888999999999999900000");
    const endingOwnerTokensBalance = await feeToken.balanceOf(ownerTokens.address);
    const endingWalletBalance = await feeToken.balanceOf(wallet.address);
    const endingSenderBalance = await feeToken.balanceOf(addr1.address);
    const endingRecipientBalance = await feeToken.balanceOf(addr2.address);

    expect(totalSupply).to.equal(endingOwnerTokensBalance);
    expect(275).to.equal(endingWalletBalance);
    expect(89750).to.equal(endingSenderBalance);
    expect(9975).to.equal(endingRecipientBalance);
  });

  it('should set a new fee', async () => {
    const oldFee = await feeToken.fee();
    const newFee = 21;

    const tx = await feeToken._setFee(newFee);
    const endingFee = await feeToken.fee();

    expect(newFee).to.equal(endingFee);
    expect(tx).to.emit(feeToken, "NewFee").withArgs(oldFee, endingFee);
  });

  it('should failed if the specified fee is more than the previous one', async () => {
    const newFee = 50;

    await expect(
      feeToken._setFee(newFee),
    ).to.be.revertedWith('FeeToken::_setFee: the specified fee is more than the previous one');
  });

  it('should set a new wallet', async () => {
    [newWallet] = await ethers.getSigners();
    const oldWallet = await feeToken.wallet();

    const tx = await feeToken._setWallet(newWallet.address);
    const endingWallet = await feeToken.wallet();

    expect(newWallet.address).to.equal(endingWallet);
    expect(tx).to.emit(feeToken, "NewWallet").withArgs(oldWallet, endingWallet);
  });
});