import { getWsProvider } from 'polkadot-api/ws-provider/web';
import {
  createClient,
  type PolkadotClient,
  type SS58String,
} from 'polkadot-api';
import { dot, people } from '@polkadot-api/descriptors';

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

// - Create a new `async` function called `getDisplayName`:
//   - It accepts two parameters:
//     - `peopleClient` which is of type `PolkadotClient`.
//     - `address` which is of type `SS58String`.
//   - It returns a `Promise<string | undefined>`.
// - Write the logic of the `getDisplayName` function:
//   - Call the `getTypedApi` method on the `peopleClient` variable.
//     - The `getTypedApi` method should include the parameter `people`, which we imported above.
//     - Assign the result to a new constant `peopleApi`.
//   - Call `peopleApi.query.Identity.IdentityOf.getValue(address)`.
//   - `await` the result, and assign it to a new constant `accountInfo`.
//   - Extract the display name with: `accountInfo?.[0].info.display.value?.asText()`
//     - Assign the result to a new constant `displayName`.
//   - Return the `displayName` constant.
async function getDisplayName(
  peopleClient: PolkadotClient,
  address: SS58String
): Promise<string | undefined> {
  const peopleApi = peopleClient.getTypedApi(people);
  const accountInfo = await peopleApi.query.Identity.IdentityOf.getValue(
    address
  );
  const displayName = accountInfo?.info.display.value?.toString();

  return displayName;
}

async function main() {
  const polkadotClient = makeClient('wss://rpc.polkadot.io');
  await printChainInfo(polkadotClient);

  const peopleClient = makeClient('wss://polkadot-people-rpc.polkadot.io');
  await printChainInfo(peopleClient);

  const address = 'example_address';
  const balance = await getBalance(polkadotClient, address);

  console.log(`Address <${address}> total balance in BigInt is: ${balance}`);

  try {
    const displayName = await getDisplayName(peopleClient, address);

    console.log(`Address <${address}> display name is: ${displayName}`);
  } catch (error) {
    console.error(
      `Cannot get display name from address <${address}>.\n`,
      error
    );
  }

  console.log(`Done!`);
  process.exit(0);
}

main();
