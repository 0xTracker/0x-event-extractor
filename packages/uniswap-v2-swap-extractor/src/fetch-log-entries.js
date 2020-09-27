const { request, gql } = require('graphql-request');
const { BigNumber } = require('@0x/utils');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

const convertAmount = (amount, decimals) => {
  const amount0In = new BigNumber(amount).times(
    new BigNumber(10).pow(new BigNumber(decimals)),
  );

  return amount0In;
};

const fetchEvents = async (fromBlock, toBlock) => {
  const query = gql`{
    swaps (
        first: 50,
        skip: 0,
        where: {
            sender: "${EXCHANGE_PROXY_ADDRESS}",
            timestamp_gte: ${fromBlock},
            timestamp_lte: ${toBlock},
    }) {
      id
      transaction {
        id
        blockNumber
        timestamp
      }
      pair {
        id
        token0 {
          id
          decimals
        }
        token1 {
          id
          decimals
        }
      }
      sender
      amount0In
      amount1In
      amount0Out
      amount1Out
      to
      logIndex
    }
  }`;

  const response = await request(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    query,
  );

  const events = response.swaps.map(swap => {
    const maker = swap.pair.id; // The Uniswap pool for traded pair
    const taker = swap.to;
    const transactionHash = swap.transaction.id;
    const { logIndex } = swap;
    const { blockNumber } = swap.transaction;

    const amount0In = convertAmount(swap.amount0In, swap.pair.token0.decimals);
    const amount1In = convertAmount(swap.amount1In, swap.pair.token1.decimals);

    const amount0Out = convertAmount(
      swap.amount0Out,
      swap.pair.token0.decimals,
    );

    const amount1Out = convertAmount(
      swap.amount1Out,
      swap.pair.token1.decimals,
    );

    const fromToken = amount0In.gt(amount1In)
      ? swap.pair.token0
      : swap.pair.token1;

    const toToken = amount0Out.gt(amount1Out)
      ? swap.pair.token0
      : swap.pair.token1;

    const fromTokenAmount = amount0In.gt(amount1In) ? amount0In : amount1In;
    const toTokenAmount = amount0Out.gt(amount1Out) ? amount0Out : amount1Out;

    return {
      blockNumber,
      data: {
        maker,
        makerAmount: fromTokenAmount,
        makerToken: fromToken.id,
        taker,
        takerAmount: toTokenAmount,
        takerToken: toToken.id,
      },
      logIndex,
      transactionHash,
    };
  });

  return events;
};

module.exports = fetchEvents;
