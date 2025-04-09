# Requirements:

- nvm

# Setting things up:

- `npm i`
- `cp .env.example .env`
- Make sure you have an ETH wallet on Sepolia Base Testnet - you can create one with Metamask. Make sure there's some ETH to cover gas costs.
- Get your wallet's private key into the `.env` file.
- `npm run contract:compile`
- `npm run contract:deploy:sepolia`
- Get the address from the deploy and put it into the `.env` as well.
- `npm run start:cli` - to use the cli and cast you votes!
