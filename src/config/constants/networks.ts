import { CHAIN_CONFIG } from "utils/types"

enum CHAIN_NAME {
    "ethereum" = "ethereum",
    "rinkeby" = "rinkeby"
}

const NETWORK_CONFIGS: { [chainName in CHAIN_NAME]: CHAIN_CONFIG } = {
    [CHAIN_NAME.ethereum]: {
        CHAIN_ID: 1,
        NODE_URL: "https://eth-mainnet.g.alchemy.com/v2/VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf",
    },
    [CHAIN_NAME.rinkeby]: {
        CHAIN_ID: 4,
        NODE_URL: "https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU"
    }
}

export default NETWORK_CONFIGS
