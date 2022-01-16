const network = hre.network.name;
const fs = require('fs');

async function main() {
  const dir = './networks/';
  const fileName = 'FeeToken_' + `${network}.json`;
  const data = JSON.parse(await fs.readFileSync(dir + fileName, { encoding: 'utf8' }));

  try {
    await hre.run('verify:verify', {
      address: data.feeToken,
      constructorArguments: [process.env.OWNER_TOKENS, process.env.WALLET, process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL],
      contract: 'contracts/FeeToken.sol:FeeToken',
    });
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
