import 'dotenv/config'
import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

const MNEMONIC = process.env.MNEMONIC
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'polygon-amoy': {
            eid: 40267,
            url: process.env.RPC_URL_AMOY || 'https://polygon-amoy.blockpi.network/v1/rpc/public',
            accounts,
            gas: 21000000,

        },
        'base-sepolia': {
            eid: 40245,
            url: process.env.RPC_URL_BASE_SEPOLIA || 'https://sepolia.base.org',
            accounts,
            gas: 21000000,

        },
        'optimism-sepolia': {
            eid: 40232,
            url: process.env.RPC_URL_OPTIMISM_SEPOLIA || 'https://sepolia.optimism.io',
            accounts,
            gas: 21000000,

        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}

export default config