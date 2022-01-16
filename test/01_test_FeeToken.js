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
    process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, process.env.TOTAL_SUPPLY);
  });

  it('should transfer', async () => {
    let amount = await BigNumber.from("100000");
    let fee = 25;
    let denom = 10000;
    let taxFee = amount.mul(fee).div(denom);
    let net = amount.sub(taxFee);

    const startOwnerTokensBalance = await feeToken.balanceOf(ownerTokens.address);
    const startWalletBalance = await feeToken.balanceOf(wallet.address);
    const startRecipientBalance = await feeToken.balanceOf(addr1.address);

    await feeToken.connect(ownerTokens).transfer(addr1.address, amount);

    const endingOwnerTokensBalance = await feeToken.balanceOf(ownerTokens.address);
    const endingWalletBalance = await feeToken.balanceOf(wallet.address);
    const endingRecipientBalance = await feeToken.balanceOf(addr1.address);

    expect(startOwnerTokensBalance.sub(amount)).to.equal(endingOwnerTokensBalance);
    expect(startWalletBalance.add(taxFee)).to.equal(endingWalletBalance);
    expect(startRecipientBalance.add(net)).to.equal(endingRecipientBalance);
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