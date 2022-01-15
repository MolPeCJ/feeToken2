const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('feeTokenTest', () => {
  beforeEach(async () => {
    [ownerTokens, wallet, addr1, addr2] = await ethers.getSigners();
    const feeTokenInstance = await ethers.getContractFactory('FeeToken');
    feeToken = await feeTokenInstance.deploy(ownerTokens.address, wallet.address, 
    process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL);
  });
  it('should transfer', async () => {
    await feeToken.transfer(addr1.address, 100000);
    await feeToken.connect(addr1).transfer(addr2.address, 10000);

    const endingWalletBalance = await feeToken.balanceOf(wallet.address);
    const endingSenderBalance = await feeToken.balanceOf(addr1.address);
    const endingRecipientBalance = await feeToken.balanceOf(addr2.address);

    expect(275).to.equal(endingWalletBalance);
    expect(89750).to.equal(endingSenderBalance);
    expect(9975).to.equal(endingRecipientBalance);
  });

  it('should set a new fee', async () => {
    const newFee = 50;

    await feeToken._setFee(newFee);

    const endingFee = await feeToken.fee();

    expect(newFee).to.equal(endingFee);
  });

  it('should set a new wallet', async () => {
    [newWallet] = await ethers.getSigners();

    await feeToken._setWallet(newWallet.address);

    const endingWallet = await feeToken.wallet();

    expect(newWallet.address).to.equal(endingWallet);
  });
});
