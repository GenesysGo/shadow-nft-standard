export type ShadowySuperMinter = {
  version: "0.1.0"
  name: "shadowy_super_minter"
  instructions: [
    {
      name: "initialize"
      accounts: [
        {
          name: "shadowySuperMinter"
          isMut: true
          isSigner: false
        },
        {
          name: "collectionMint"
          isMut: false
          isSigner: false
        },
        {
          name: "authority"
          isMut: false
          isSigner: false
        },
        {
          name: "payer"
          isMut: true
          isSigner: true
        },
        {
          name: "shadowNftStandardProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "sysvarInstructions"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "data"
          type: {
            defined: "state::ShadowySuperMinterData"
          }
        }
      ]
    },
    {
      name: "mint"
      accounts: [
        {
          name: "shadowySuperMinter"
          isMut: true
          isSigner: false
        },
        {
          name: "authority"
          isMut: false
          isSigner: false
        },
        {
          name: "minter"
          isMut: true
          isSigner: true
        },
        {
          name: "payerCreator"
          isMut: true
          isSigner: true
        },
        {
          name: "minterAta"
          isMut: true
          isSigner: false
        },
        {
          name: "mint"
          isMut: true
          isSigner: false
        },
        {
          name: "metadata"
          isMut: true
          isSigner: false
        },
        {
          name: "creatorGroup"
          isMut: false
          isSigner: false
        },
        {
          name: "collectionMint"
          isMut: true
          isSigner: false
        },
        {
          name: "shadowNftStandard"
          isMut: false
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "recentSlothashes"
          isMut: false
          isSigner: false
        },
        {
          name: "instructionSysvarAccount"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "bump"
          type: "u8"
        }
      ]
    },
    {
      name: "addAssets"
      accounts: [
        {
          name: "shadowySuperMinter"
          isMut: true
          isSigner: false
        },
        {
          name: "authority"
          isMut: false
          isSigner: true
        }
      ]
      args: [
        {
          name: "index"
          type: "u32"
        },
        {
          name: "assets"
          type: {
            vec: {
              defined: "state::Asset"
            }
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: "shadowySuperMinter"
      type: {
        kind: "struct"
        fields: [
          {
            name: "authority"
            type: "publicKey"
          },
          {
            name: "itemsRedeemed"
            type: "u64"
          },
          {
            name: "data"
            type: {
              defined: "ShadowySuperMinterData"
            }
          }
        ]
      }
    }
  ]
  types: [
    {
      name: "Asset"
      type: {
        kind: "struct"
        fields: [
          {
            name: "name"
            type: "string"
          },
          {
            name: "uri"
            type: "string"
          }
        ]
      }
    },
    {
      name: "ShadowySuperMinterData"
      type: {
        kind: "struct"
        fields: [
          {
            name: "itemsAvailable"
            type: "u64"
          },
          {
            name: "symbol"
            type: "string"
          },
          {
            name: "sellerFeeBasisPoints"
            type: "u16"
          },
          {
            name: "isMutable"
            type: "bool"
          },
          {
            name: "creators"
            type: {
              vec: {
                defined: "Creator"
              }
            }
          },
          {
            name: "price"
            type: "u64"
          }
        ]
      }
    },
    {
      name: "Creator"
      type: {
        kind: "struct"
        fields: [
          {
            name: "address"
            type: "publicKey"
          },
          {
            name: "verified"
            type: "bool"
          },
          {
            name: "percentageShare"
            type: "u8"
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: "Uninitialized"
      msg: "Account is not initialized"
    },
    {
      code: 6001
      name: "IndexGreaterThanLength"
      msg: "Index greater than length"
    },
    {
      code: 6002
      name: "NumericalOverflowError"
      msg: "Numerical overflow error"
    },
    {
      code: 6003
      name: "TooManyCreators"
      msg: "Can only provide up to 4 creators to ssm (because ssm is one)"
    },
    {
      code: 6004
      name: "ShadowySuperMinterEmpty"
      msg: "SSM is empty"
    },
    {
      code: 6005
      name: "MetadataAccountMustBeEmpty"
      msg: "The metadata account has data in it, and this must be empty to mint a new NFT"
    },
    {
      code: 6006
      name: "InvalidMintAuthority"
      msg: "Mint authority provided does not match the authority on the mint"
    },
    {
      code: 6007
      name: "CannotFindUsableAsset"
      msg: "Unable to find an unused asset near your random number index"
    },
    {
      code: 6008
      name: "InvalidString"
      msg: "Invalid string"
    }
  ]
  metadata: {
    address: "AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu"
  }
}

export const IDL: ShadowySuperMinter = {
  version: "0.1.0",
  name: "shadowy_super_minter",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "shadowySuperMinter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "shadowNftStandardProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "sysvarInstructions",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "state::ShadowySuperMinterData",
          },
        },
      ],
    },
    {
      name: "mint",
      accounts: [
        {
          name: "shadowySuperMinter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "minter",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payerCreator",
          isMut: true,
          isSigner: true,
        },
        {
          name: "minterAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creatorGroup",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "shadowNftStandard",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "recentSlothashes",
          isMut: false,
          isSigner: false,
        },
        {
          name: "instructionSysvarAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "addAssets",
      accounts: [
        {
          name: "shadowySuperMinter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "index",
          type: "u32",
        },
        {
          name: "assets",
          type: {
            vec: {
              defined: "state::Asset",
            },
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "shadowySuperMinter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "itemsRedeemed",
            type: "u64",
          },
          {
            name: "data",
            type: {
              defined: "ShadowySuperMinterData",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Asset",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
        ],
      },
    },
    {
      name: "ShadowySuperMinterData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "itemsAvailable",
            type: "u64",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
          {
            name: "isMutable",
            type: "bool",
          },
          {
            name: "creators",
            type: {
              vec: {
                defined: "Creator",
              },
            },
          },
          {
            name: "price",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Creator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "verified",
            type: "bool",
          },
          {
            name: "percentageShare",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Uninitialized",
      msg: "Account is not initialized",
    },
    {
      code: 6001,
      name: "IndexGreaterThanLength",
      msg: "Index greater than length",
    },
    {
      code: 6002,
      name: "NumericalOverflowError",
      msg: "Numerical overflow error",
    },
    {
      code: 6003,
      name: "TooManyCreators",
      msg: "Can only provide up to 4 creators to ssm (because ssm is one)",
    },
    {
      code: 6004,
      name: "ShadowySuperMinterEmpty",
      msg: "SSM is empty",
    },
    {
      code: 6005,
      name: "MetadataAccountMustBeEmpty",
      msg: "The metadata account has data in it, and this must be empty to mint a new NFT",
    },
    {
      code: 6006,
      name: "InvalidMintAuthority",
      msg: "Mint authority provided does not match the authority on the mint",
    },
    {
      code: 6007,
      name: "CannotFindUsableAsset",
      msg: "Unable to find an unused asset near your random number index",
    },
    {
      code: 6008,
      name: "InvalidString",
      msg: "Invalid string",
    },
  ],
  metadata: {
    address: "AzCnwh6WUTNmwn1GAF7VP3bnP6VxHCcgP3iWzgmwAxUu",
  },
}
