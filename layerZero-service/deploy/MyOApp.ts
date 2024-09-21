import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'MyOApp'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    // Define initial rate limit configurations
    const initialRateLimits = [
        {
            dstEid: 1, // Example destination endpoint ID
            limit: 1000, // Example limit
            window: 3600 // Example window in seconds (1 hour)
        }
        // Add more rate limit configs as needed
    ]

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
           
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    });

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy