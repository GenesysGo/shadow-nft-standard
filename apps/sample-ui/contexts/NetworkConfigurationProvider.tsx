
import { FC, ReactNode, createContext, useContext } from "react"
import { useLocalStorage } from "@solana/wallet-adapter-react"

export interface NetworkConfigurationState {
  networkConfiguration: string
  setNetworkConfiguration(networkConfiguration: string): void
}

export const NetworkConfigurationContext =
  createContext<NetworkConfigurationState>({} as NetworkConfigurationState)

export function useNetworkConfiguration(): NetworkConfigurationState {
  return useContext(NetworkConfigurationContext)
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [networkConfiguration, setNetworkConfiguration] = useLocalStorage(
    "network",
    "devnet"
  )

  return (
    <NetworkConfigurationContext.Provider
      value={{ networkConfiguration, setNetworkConfiguration }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  )
}
