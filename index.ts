import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { createClient, type PolkadotClient } from 'polkadot-api';

function makeClient(endpoint: string): PolkadotClient {
  console.log(`Connecting to endpoint: ${endpoint}`);
  // Connects via a WebSocket URL, often used for real-time interactions.
  const provider = getWsProvider('wss://rpc.polkadot.io');

  // The client is responsible for making RPC calls to the chain,
  // fetching metadata, and enabling interactions
  // like querying storage or sending transactions.
  const client: PolkadotClient = createClient(provider);

  return client;
}

async function printChainInfo(client: PolkadotClient) {
  const chainSpec = await client.getChainSpecData();

  const finalizedBlock = await client.getFinalizedBlock();

  console.log(
    `chainSpec.name: ${chainSpec.name}, finalizedBlock.number: ${finalizedBlock.number}`
  );
}

async function main() {
  const endpoint = 'wss://rpc.polkadot.io';
  const client = makeClient(endpoint);

  await printChainInfo(client);

  console.log(`Done!`);
  process.exit(0);
}

main();
