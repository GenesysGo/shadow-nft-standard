export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Shadow NFT",
  description: "Sample website for minting and managing Shadow NFTs",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Mint",
      href: "/mint",
    },
    {
      title: "Create",
      href: "/create",
    },
    {
      title: "View NFTs",
      href: "/wallet",
    },
    {
      title: "Manage Collections",
      href: "/manage-collections",
    },
    {
      title: "Manage Creator Groups",
      href: "/manage-creator-groups",
    },
  ],
  links: {
    twitter: "https://twitter.com/genesysgo",
    github: "https://github.com/genesysgo/shadow-nft-standard",
    docs: "https://github.com/GenesysGo/shadow-nft-standard/wiki",
  },
}
