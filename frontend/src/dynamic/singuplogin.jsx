import {
    DynamicContextProvider,
    DynamicWidget,
  } from "@dynamic-labs/sdk-react-core";

  import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

  
  export default function SignUpLogin() {
  
    return (
      <DynamicContextProvider
      // style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }} 
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          environmentId: process.env.REACT_APP_DYNAMIC_ENV_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWidget />
      </DynamicContextProvider>
    );
  };