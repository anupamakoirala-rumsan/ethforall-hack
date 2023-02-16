const POLYGON_TEST_NET_CHAIN_ID = 80001;
const BINANCE_TEST_NET_CHAIN_ID = 97;
module.exports = {
  POLYGON_TEST_NET_CHAIN_ID,
  BINANCE_TEST_NET_CHAIN_ID,
  SYMBOLS: {
    97: "BNB",
    80001: "MATIC",
  },
  SUPPORTED_CHAINS: {
    97: {
      chainId: "0x61",
      chainName: "Binance Smart Chain Testnet",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://data-seed-prebsc-1-s3.binance.org:8545/"],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
    80001: {
      chainId: "0x13881",
      chainName: "Polygon Testnet Mumbai",
      nativeCurrency: {
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    },
  },
};
