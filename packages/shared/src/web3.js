const { RPCSubprovider, Web3ProviderEngine } = require('@0x/subproviders');
const { Web3Wrapper } = require('@0x/web3-wrapper');
const { providerUtils } = require('@0x/utils');

let wrapper;
let providerEngine;
/**
 * Initializes a web3 provider engine and create a reusable web3 wrapper. The
 * singletons can be accessed via getProviderEngine and getWrapper respectively.
 *
 * @param {Object} options - Configuration options.
 * @param {string} options.endpoint - RPC endpoint of an Ethereum node.
 */
const configure = ({ endpoint }) => {
  providerEngine = new Web3ProviderEngine();
  wrapper = new Web3Wrapper(providerEngine);

  // TransformedERC20 events
  wrapper.abiDecoder.addABI([
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'taker',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'inputToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'outputToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'inputTokenAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'outputTokenAmount',
          type: 'uint256',
        },
      ],
      name: 'TransformedERC20',
      type: 'event',
    },
  ]);

  // LiquidityProviderSwap events
  wrapper.abiDecoder.addABI([
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'inputToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'outputToken',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'inputTokenAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'outputTokenAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'provider',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
      ],
      name: 'LiquidityProviderSwap',
      type: 'event',
    },
  ]);

  providerEngine.addProvider(new RPCSubprovider(endpoint));
  providerUtils.startProviderEngine(providerEngine);
};

/**
 * Get the current global web3 wrapper instance.
 *
 * @returns {Web3Wrapper}
 */
const getWrapper = () => wrapper;

const getProviderEngine = () => providerEngine;

module.exports = { configure, getProviderEngine, getWrapper };
