import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useTheme } from "next-themes"
import styled from "styled-components"

// Define a styled component
const StyledWalletMultiButton = styled(WalletMultiButton)`
  && {
    &.dark {
      color: white !important;

      &:hover {
        color: black !important;
        background-color: white !important;
      }
    }

    &.light {
      color: black !important;

      &:hover {
        color: white !important;
        background-color: black !important;
      }
    }
  }
`

require("@solana/wallet-adapter-react-ui/styles.css")

const ConnectWalletButton = (props: any) => {
  const { theme } = useTheme()

  return (
    <>
      <StyledWalletMultiButton
        className={theme === "light" ? "light" : "dark"}
        // className={buttonVariants({
        //   size: "sm",
        //   variant: "default",
        // })}
      />
    </>
  )
}

export default ConnectWalletButton
