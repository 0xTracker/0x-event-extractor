const { request, gql } = require('graphql-request');
const { BigNumber } = require('@0x/utils');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

const convertAmount = (amount, decimals) => {
  return new BigNumber(amount).times(
    new BigNumber(10).pow(new BigNumber(decimals)),
  );
};

const fetchEvents = async (fromBlock, toBlock, skip = 0) => {
  const pageSize = 100;
  const query = gql`{
    swaps (
        first: ${pageSize},
        skip: ${skip},
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
      pool {
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
      amount0
      amount1
      recipient
      logIndex
    }
  }`;

  const response = await request(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    query,
  );

  const events = response.swaps.map(swap => {
    const maker = swap.pool.id; // The Uniswap pool for traded pool
    const taker = swap.recipient;
    const transactionHash = swap.transaction.id;
    const { logIndex } = swap;
    const { blockNumber } = swap.transaction;

    const amount0 = convertAmount(swap.amount0, swap.pool.token0.decimals);
    const amount1 = convertAmount(swap.amount1, swap.pool.token1.decimals);

    const fromToken = amount0.lt(0) ? swap.pool.token0 : swap.pool.token1;
    const toToken = amount0.gt(0) ? swap.pool.token0 : swap.pool.token1;

    const fromTokenAmount = amount0.lt(0) ? amount0 : amount1;
    const toTokenAmount = amount0.gt(0) ? amount0 : amount1;

    return {
      blockNumber,
      data: {
        maker,
        makerAmount: Math.abs(fromTokenAmount),
        makerToken: fromToken.id,
        taker,
        takerAmount: Math.abs(toTokenAmount),
        takerToken: toToken.id,
      },
      logIndex,
      transactionHash,
    };
  });

  if (events.length === pageSize) {
    const nextEvents = await fetchEvents(fromBlock, toBlock, skip + pageSize);

    return events.concat(nextEvents);
  }

  return events;
};

module.exports = fetchEvents;
