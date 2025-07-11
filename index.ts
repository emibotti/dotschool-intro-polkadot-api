import { getWsProvider } from 'polkadot-api/ws-provider/web';
import {
  createClient,
  type PolkadotClient,
  type SS58String,
} from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';

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

// - Create a new `async` function called `getBalance`:
//   - It accepts two parameters:
//     - A parameter named `polkadotClient` which is of type `PolkadotClient`.
//     - A parameter named `address` which is of type `SS58String` which we imported above.
//   - It returns a `Promise<BigInt>`.
// - Write the logic of the `getBalance` function:
//   - Call the `getTypedApi` method on the `polkadotClient` variable.
//     - The `getTypedApi` method should include the parameter `dot`, which we imported above.
//     - Assign the result to a new constant `dotApi`.
//   - Call `dotApi.query.System.Account.getValue(address)`.
//   - `await` the result, and assign it to a new constant `accountInfo`.
//   - Extract the `free` and `reserved` balance from `accountInfo.data`.
//   - Return the sum of `free` and `reserved`.
async function getBalance(
  polkadotClient: PolkadotClient,
  address: SS58String
): Promise<BigInt> {
  // The strongly typed interface can be used in a sync or async
  const dotApi = polkadotClient.getTypedApi(dot);
  const accountInfo = await dotApi.query.System.Account.getValue(address);

  const { free, reserved } = accountInfo.data;

  // INFO: total_balance = free_balance + reserved_balance
  return free + reserved;
}

async function main() {
  const endpoint = 'wss://rpc.polkadot.io';
  const client = makeClient(endpoint);

  const address = 'example_address';
  const balance = await getBalance(client, address);

  console.log(`Address <${address}> total balance is: ${balance}`);

  await printChainInfo(client);

  console.log(`Done!`);
  process.exit(0);
}

main();
