export type ShadowNftStandard = {
  version: "0.1.0"
  name: "shadow_nft_standard"
  instructions: [
    {
      name: "createMetadataAccount"
      docs: [
        "Instruction to create a metadata account. A `CreatorGroup` and `Collection` must be initialized."
      ]
      accounts: [
        {
          name: "metadata"
          isMut: true
          isSigner: false
          docs: ["The metadata account to be initialized."]
        },
        {
          name: "creatorGroup"
          isMut: false
          isSigner: false
          docs: [
            "NOTE: If this mutability changes + if creator group code changes,",
            "we must revisit group seed"
          ]
        },
        {
          name: "assetMint"
          isMut: false
          isSigner: false
          docs: ["The token program mint account of the NFT"]
        },
        {
          name: "collection"
          isMut: true
          isSigner: false
          docs: ["The `Collection` account associated with this NFT"]
        },
        {
          name: "payerCreator"
          isMut: true
          isSigner: true
          docs: [
            "Either a creator or an ephemeral payer pda from the minter program."
          ]
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "args"
          type: {
            defined: "CreateMetaArgs"
          }
        }
      ]
    },
    {
      name: "mintNft"
      docs: [
        "Instruction to mint an NFT. Requires an existing metadata account."
      ]
      accounts: [
        {
          name: "metadata"
          isMut: true
          isSigner: false
        },
        {
          name: "minter"
          isMut: true
          isSigner: true
        },
        {
          name: "minterAta"
          isMut: true
          isSigner: false
        },
        {
          name: "assetMint"
          isMut: true
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
        }
      ]
      args: [
        {
          name: "costLamports"
          type: "u64"
        }
      ]
    },
    {
      name: "updateMetadata"
      docs: [
        "Instruction to update a metadata account. Requires an existing metadata account."
      ]
      accounts: [
        {
          name: "metadata"
          isMut: true
          isSigner: false
          docs: [
            "The metadata account in question. Since it is already initialized,",
            "the asset_mint must be valid since it was checked upon initialization."
          ]
        },
        {
          name: "assetMint"
          isMut: false
          isSigner: false
          docs: ["The mint of the nft in question. Checked upon initialization"]
        },
        {
          name: "updateAuthority"
          isMut: false
          isSigner: true
        },
        {
          name: "creatorGroup"
          isMut: false
          isSigner: false
          docs: ["The creator of the NFT and collection"]
        },
        {
          name: "collection"
          isMut: false
          isSigner: false
          docs: ["The collection that the NFT belongs to"]
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "args"
          type: {
            defined: "UpdateMetaArgs"
          }
        }
      ]
    },
    {
      name: "burn"
      docs: ["Instruction to burn a metadata account and associated NFT."]
      accounts: [
        {
          name: "metadata"
          isMut: true
          isSigner: false
          docs: ["Metadata account to burn"]
        },
        {
          name: "assetMint"
          isMut: true
          isSigner: false
          docs: ["NFT Token Mint"]
        },
        {
          name: "ownerAta"
          isMut: true
          isSigner: false
          docs: ["Owner's Token Account"]
        },
        {
          name: "owner"
          isMut: true
          isSigner: true
          docs: ["Owner of the NFT"]
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
          docs: ["Token program"]
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
          docs: ["System program"]
        }
      ]
      args: []
    },
    {
      name: "createGroup"
      accounts: [
        {
          name: "creatorGroup"
          isMut: true
          isSigner: false
          docs: ["The creator group account to be initialized"]
        },
        {
          name: "creator"
          isMut: true
          isSigner: true
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "args"
          type: {
            defined: "CreateGroupArgs"
          }
        }
      ]
    },
    {
      name: "createCollection"
      accounts: [
        {
          name: "collection"
          isMut: true
          isSigner: false
          docs: ["The collection account to be initialized"]
        },
        {
          name: "creatorGroup"
          isMut: false
          isSigner: false
          docs: ["The creator group"]
        },
        {
          name: "payerCreator"
          isMut: true
          isSigner: true
          docs: [
            "A creator within the creator group which is paying to initalize the collection"
          ]
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "args"
          type: {
            defined: "CreateCollectionArgs"
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: "collection"
      type: {
        kind: "struct"
        fields: [
          {
            name: "creatorGroupKey"
            docs: ["Pubkey of the creator group that created this collection"]
            type: "publicKey"
          },
          {
            name: "size"
            docs: ["Number of items in the collection"]
            type: "u32"
          },
          {
            name: "sigs"
            docs: [
              "Signatures indicating whether the collection has been signed by all creators"
            ]
            type: "u8"
          },
          {
            name: "royalty50bps"
            docs: [
              "Royalty per creator (in half-percentages!). Half-percentages are used",
              "to be able to use a single byte (0 to 255) effectively.",
              "",
              "# Examples",
              "`royalty_50bps_multiplier` = 4",
              "-> 4 * 0.5% = 2% royalty",
              "",
              "`royalty_50bps_multiplier` = 7",
              "-> 7 * 0.5% = 3.5% royalty",
              "",
              "The number of nonzero entries must match the number of creators in the creator group.",
              "This should be enforced upon the initialization of a collection."
            ]
            type: {
              array: ["u8", 8]
            }
          },
          {
            name: "symbol"
            docs: ["Symbol for the collection"]
            type: {
              defined: "Symbol"
            }
          },
          {
            name: "name"
            docs: ["Name for the collection"]
            type: "string"
          }
        ]
      }
    },
    {
      name: "creatorGroup"
      type: {
        kind: "struct"
        fields: [
          {
            name: "sigs"
            docs: ["Number of signatures collected"]
            type: "u8"
          },
          {
            name: "numCollections"
            docs: [
              "Counter keeping track of the number of collections that have been made"
            ]
            type: "u64"
          },
          {
            name: "creators"
            docs: ["The creators that make up this group"]
            type: {
              vec: "publicKey"
            }
          },
          {
            name: "name"
            docs: ["The name of the group"]
            type: "string"
          }
        ]
      }
    },
    {
      name: "metadata"
      type: {
        kind: "struct"
        fields: [
          {
            name: "mint"
            docs: [
              "The spl-token-2022 mint address of the token associated with the NFT"
            ]
            type: "publicKey"
          },
          {
            name: "updateAuthority"
            docs: [
              "The pubkey of the upgrade authority of this metadata account"
            ]
            type: "publicKey"
          },
          {
            name: "collectionKey"
            docs: [
              "Pubkey of the collection that this asset belongs to.",
              "",
              "Contains information about royalties, creator group, collection size,",
              "the collection symbol, and whether it's verified"
            ]
            type: "publicKey"
          },
          {
            name: "postPrimary"
            docs: ["Used to discriminate between primary and secondary sales"]
            type: "bool"
          },
          {
            name: "mutable"
            docs: ["Marks metadata as mutable or immutable"]
            type: "bool"
          },
          {
            name: "name"
            docs: ["The asset's name"]
            type: "string"
          },
          {
            name: "uri"
            docs: ["Location of the off-chain metadata"]
            type: {
              defined: "Url"
            }
          }
        ]
      }
    }
  ]
  types: [
    {
      name: "Symbol"
      docs: [
        "Only valid ASCII is allowed",
        "",
        "(TODO: should we extend to all utf-8?)"
      ]
      type: {
        kind: "struct"
        fields: [
          {
            name: "inner"
            type: {
              array: ["u8", 8]
            }
          }
        ]
      }
    },
    {
      name: "Url"
      type: {
        kind: "struct"
        fields: [
          {
            name: "prefix"
            type: {
              defined: "Prefix"
            }
          },
          {
            name: "object"
            type: "string"
          }
        ]
      }
    },
    {
      name: "CreateCollectionArgs"
      type: {
        kind: "struct"
        fields: [
          {
            name: "name"
            docs: ["The name of the collection"]
            type: "string"
          },
          {
            name: "symbol"
            docs: ["The symbol for the collection"]
            type: "string"
          },
          {
            name: "royalty50bps"
            docs: [
              "The royalties for the collection in half-percentages. This must be in",
              "the same order as the creator keys are stored (they are sorted by `Pubkey`).",
              "",
              "Half-percentage are used to maximize the utility of a single `u8`."
            ]
            type: "bytes"
          }
        ]
      }
    },
    {
      name: "CreateGroupArgs"
      type: {
        kind: "struct"
        fields: [
          {
            name: "name"
            type: "string"
          }
        ]
      }
    },
    {
      name: "CreateMetaArgs"
      type: {
        kind: "struct"
        fields: [
          {
            name: "updateAuthority"
            type: "publicKey"
          },
          {
            name: "name"
            type: "string"
          },
          {
            name: "uri"
            type: {
              defined: "Url"
            }
          },
          {
            name: "mutable"
            type: "bool"
          },
          {
            name: "collectionKey"
            type: "publicKey"
          }
        ]
      }
    },
    {
      name: "UpdateMetaArgs"
      docs: [
        "Only the following fields should be updatable:",
        "1) name",
        "3) uri",
        "5) mutable"
      ]
      type: {
        kind: "struct"
        fields: [
          {
            name: "name"
            type: {
              option: "string"
            }
          },
          {
            name: "uri"
            type: {
              option: "string"
            }
          },
          {
            name: "mutable"
            type: {
              option: "bool"
            }
          }
        ]
      }
    },
    {
      name: "SymbolError"
      type: {
        kind: "enum"
        variants: [
          {
            name: "InvalidAscii"
          },
          {
            name: "IncorrectCaseOrInvalidCharacters"
          },
          {
            name: "ExceedsMaxLength"
          }
        ]
      }
    },
    {
      name: "Prefix"
      docs: [
        "The common prefix of a `Url`. This is separated since a minter will hold a common prefix."
      ]
      type: {
        kind: "enum"
        variants: [
          {
            name: "ShadowDrive"
            fields: [
              {
                name: "account"
                type: "publicKey"
              }
            ]
          },
          {
            name: "Arweave"
          },
          {
            name: "Other"
            fields: [
              {
                name: "prefix"
                type: "string"
              }
            ]
          }
        ]
      }
    }
  ]
  errors: [
    {
      code: 6000
      name: "FreezeAuthorityPresent"
      msg: "Mint account has a freeze authority"
    },
    {
      code: 6001
      name: "InvalidMintAuthority"
      msg: "Metadata account must have mint authority"
    },
    {
      code: 6002
      name: "DivisibleToken"
      msg: "Mint account either has a nonunitary supply or nonzero decimals"
    },
    {
      code: 6003
      name: "PrimarySale"
      msg: "Primary sale already occured"
    },
    {
      code: 6004
      name: "InsufficientSolForMint"
      msg: "Insufficient SOL for mint"
    },
    {
      code: 6005
      name: "Unauthorized"
      msg: "Unauthorized"
    },
    {
      code: 6006
      name: "ImmutableAccount"
      msg: "This metadata accounts is immutable"
    },
    {
      code: 6007
      name: "InvalidArguments"
      msg: "The instruction received invalid input"
    },
    {
      code: 6008
      name: "ExceedsMaxGroupSize"
      msg: "Attempted to create a group which exceeds the maximum number of members"
    },
    {
      code: 6009
      name: "CreatorMustBeSystemAccount"
      msg: "A creator must be a system account"
    },
    {
      code: 6010
      name: "CreatorNotPresentForMultisig"
      msg: "A creator was not present for a multisig operation"
    },
    {
      code: 6011
      name: "CreatorNotSignerForMultisig"
      msg: "A creator did not sign for a multisig operation"
    },
    {
      code: 6012
      name: "SymbolToolarge"
      msg: "The symbol provided is too large"
    },
    {
      code: 6013
      name: "IncorrectCreatorGroupSize"
      msg: "Incorrect creator group size"
    },
    {
      code: 6014
      name: "IntegerOverflow"
      msg: "An integer overflowed"
    },
    {
      code: 6015
      name: "UnintializedGroup"
      msg: "Not all creators have signed to create this group"
    },
    {
      code: 6016
      name: "UnintializedCollection"
      msg: "Not all creators have signed to create this collection"
    }
  ]
  metadata: {
    address: "9fQse1hBRfzWweeUod6WEsR4jZf7hVucetEheCaWooY5"
  }
}

export const IDL: ShadowNftStandard = {
  version: "0.1.0",
  name: "shadow_nft_standard",
  instructions: [
    {
      name: "createMetadataAccount",
      docs: [
        "Instruction to create a metadata account. A `CreatorGroup` and `Collection` must be initialized.",
      ],
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
          docs: ["The metadata account to be initialized."],
        },
        {
          name: "creatorGroup",
          isMut: false,
          isSigner: false,
          docs: [
            "NOTE: If this mutability changes + if creator group code changes,",
            "we must revisit group seed",
          ],
        },
        {
          name: "assetMint",
          isMut: false,
          isSigner: false,
          docs: ["The token program mint account of the NFT"],
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
          docs: ["The `Collection` account associated with this NFT"],
        },
        {
          name: "payerCreator",
          isMut: true,
          isSigner: true,
          docs: [
            "Either a creator or an ephemeral payer pda from the minter program.",
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "CreateMetaArgs",
          },
        },
      ],
    },
    {
      name: "mintNft",
      docs: [
        "Instruction to mint an NFT. Requires an existing metadata account.",
      ],
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "minter",
          isMut: true,
          isSigner: true,
        },
        {
          name: "minterAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "assetMint",
          isMut: true,
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
      ],
      args: [
        {
          name: "costLamports",
          type: "u64",
        },
      ],
    },
    {
      name: "updateMetadata",
      docs: [
        "Instruction to update a metadata account. Requires an existing metadata account.",
      ],
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
          docs: [
            "The metadata account in question. Since it is already initialized,",
            "the asset_mint must be valid since it was checked upon initialization.",
          ],
        },
        {
          name: "assetMint",
          isMut: false,
          isSigner: false,
          docs: [
            "The mint of the nft in question. Checked upon initialization",
          ],
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "creatorGroup",
          isMut: false,
          isSigner: false,
          docs: ["The creator of the NFT and collection"],
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
          docs: ["The collection that the NFT belongs to"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "UpdateMetaArgs",
          },
        },
      ],
    },
    {
      name: "burn",
      docs: ["Instruction to burn a metadata account and associated NFT."],
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
          docs: ["Metadata account to burn"],
        },
        {
          name: "assetMint",
          isMut: true,
          isSigner: false,
          docs: ["NFT Token Mint"],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: ["Owner's Token Account"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: ["Owner of the NFT"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token program"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System program"],
        },
      ],
      args: [],
    },
    {
      name: "createGroup",
      accounts: [
        {
          name: "creatorGroup",
          isMut: true,
          isSigner: false,
          docs: ["The creator group account to be initialized"],
        },
        {
          name: "creator",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "CreateGroupArgs",
          },
        },
      ],
    },
    {
      name: "createCollection",
      accounts: [
        {
          name: "collection",
          isMut: true,
          isSigner: false,
          docs: ["The collection account to be initialized"],
        },
        {
          name: "creatorGroup",
          isMut: false,
          isSigner: false,
          docs: ["The creator group"],
        },
        {
          name: "payerCreator",
          isMut: true,
          isSigner: true,
          docs: [
            "A creator within the creator group which is paying to initalize the collection",
          ],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "CreateCollectionArgs",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "collection",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creatorGroupKey",
            docs: ["Pubkey of the creator group that created this collection"],
            type: "publicKey",
          },
          {
            name: "size",
            docs: ["Number of items in the collection"],
            type: "u32",
          },
          {
            name: "sigs",
            docs: [
              "Signatures indicating whether the collection has been signed by all creators",
            ],
            type: "u8",
          },
          {
            name: "royalty50bps",
            docs: [
              "Royalty per creator (in half-percentages!). Half-percentages are used",
              "to be able to use a single byte (0 to 255) effectively.",
              "",
              "# Examples",
              "`royalty_50bps_multiplier` = 4",
              "-> 4 * 0.5% = 2% royalty",
              "",
              "`royalty_50bps_multiplier` = 7",
              "-> 7 * 0.5% = 3.5% royalty",
              "",
              "The number of nonzero entries must match the number of creators in the creator group.",
              "This should be enforced upon the initialization of a collection.",
            ],
            type: {
              array: ["u8", 8],
            },
          },
          {
            name: "symbol",
            docs: ["Symbol for the collection"],
            type: {
              defined: "Symbol",
            },
          },
          {
            name: "name",
            docs: ["Name for the collection"],
            type: "string",
          },
        ],
      },
    },
    {
      name: "creatorGroup",
      type: {
        kind: "struct",
        fields: [
          {
            name: "sigs",
            docs: ["Number of signatures collected"],
            type: "u8",
          },
          {
            name: "numCollections",
            docs: [
              "Counter keeping track of the number of collections that have been made",
            ],
            type: "u64",
          },
          {
            name: "creators",
            docs: ["The creators that make up this group"],
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "name",
            docs: ["The name of the group"],
            type: "string",
          },
        ],
      },
    },
    {
      name: "metadata",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            docs: [
              "The spl-token-2022 mint address of the token associated with the NFT",
            ],
            type: "publicKey",
          },
          {
            name: "updateAuthority",
            docs: [
              "The pubkey of the upgrade authority of this metadata account",
            ],
            type: "publicKey",
          },
          {
            name: "collectionKey",
            docs: [
              "Pubkey of the collection that this asset belongs to.",
              "",
              "Contains information about royalties, creator group, collection size,",
              "the collection symbol, and whether it's verified",
            ],
            type: "publicKey",
          },
          {
            name: "postPrimary",
            docs: ["Used to discriminate between primary and secondary sales"],
            type: "bool",
          },
          {
            name: "mutable",
            docs: ["Marks metadata as mutable or immutable"],
            type: "bool",
          },
          {
            name: "name",
            docs: ["The asset's name"],
            type: "string",
          },
          {
            name: "uri",
            docs: ["Location of the off-chain metadata"],
            type: {
              defined: "Url",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Symbol",
      docs: [
        "Only valid ASCII is allowed",
        "",
        "(TODO: should we extend to all utf-8?)",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "inner",
            type: {
              array: ["u8", 8],
            },
          },
        ],
      },
    },
    {
      name: "Url",
      type: {
        kind: "struct",
        fields: [
          {
            name: "prefix",
            type: {
              defined: "Prefix",
            },
          },
          {
            name: "object",
            type: "string",
          },
        ],
      },
    },
    {
      name: "CreateCollectionArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            docs: ["The name of the collection"],
            type: "string",
          },
          {
            name: "symbol",
            docs: ["The symbol for the collection"],
            type: "string",
          },
          {
            name: "royalty50bps",
            docs: [
              "The royalties for the collection in half-percentages. This must be in",
              "the same order as the creator keys are stored (they are sorted by `Pubkey`).",
              "",
              "Half-percentage are used to maximize the utility of a single `u8`.",
            ],
            type: "bytes",
          },
        ],
      },
    },
    {
      name: "CreateGroupArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
        ],
      },
    },
    {
      name: "CreateMetaArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "updateAuthority",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "uri",
            type: {
              defined: "Url",
            },
          },
          {
            name: "mutable",
            type: "bool",
          },
          {
            name: "collectionKey",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "UpdateMetaArgs",
      docs: [
        "Only the following fields should be updatable:",
        "1) name",
        "3) uri",
        "5) mutable",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              option: "string",
            },
          },
          {
            name: "uri",
            type: {
              option: "string",
            },
          },
          {
            name: "mutable",
            type: {
              option: "bool",
            },
          },
        ],
      },
    },
    {
      name: "SymbolError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidAscii",
          },
          {
            name: "IncorrectCaseOrInvalidCharacters",
          },
          {
            name: "ExceedsMaxLength",
          },
        ],
      },
    },
    {
      name: "Prefix",
      docs: [
        "The common prefix of a `Url`. This is separated since a minter will hold a common prefix.",
      ],
      type: {
        kind: "enum",
        variants: [
          {
            name: "ShadowDrive",
            fields: [
              {
                name: "account",
                type: "publicKey",
              },
            ],
          },
          {
            name: "Arweave",
          },
          {
            name: "Other",
            fields: [
              {
                name: "prefix",
                type: "string",
              },
            ],
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "FreezeAuthorityPresent",
      msg: "Mint account has a freeze authority",
    },
    {
      code: 6001,
      name: "InvalidMintAuthority",
      msg: "Metadata account must have mint authority",
    },
    {
      code: 6002,
      name: "DivisibleToken",
      msg: "Mint account either has a nonunitary supply or nonzero decimals",
    },
    {
      code: 6003,
      name: "PrimarySale",
      msg: "Primary sale already occured",
    },
    {
      code: 6004,
      name: "InsufficientSolForMint",
      msg: "Insufficient SOL for mint",
    },
    {
      code: 6005,
      name: "Unauthorized",
      msg: "Unauthorized",
    },
    {
      code: 6006,
      name: "ImmutableAccount",
      msg: "This metadata accounts is immutable",
    },
    {
      code: 6007,
      name: "InvalidArguments",
      msg: "The instruction received invalid input",
    },
    {
      code: 6008,
      name: "ExceedsMaxGroupSize",
      msg: "Attempted to create a group which exceeds the maximum number of members",
    },
    {
      code: 6009,
      name: "CreatorMustBeSystemAccount",
      msg: "A creator must be a system account",
    },
    {
      code: 6010,
      name: "CreatorNotPresentForMultisig",
      msg: "A creator was not present for a multisig operation",
    },
    {
      code: 6011,
      name: "CreatorNotSignerForMultisig",
      msg: "A creator did not sign for a multisig operation",
    },
    {
      code: 6012,
      name: "SymbolToolarge",
      msg: "The symbol provided is too large",
    },
    {
      code: 6013,
      name: "IncorrectCreatorGroupSize",
      msg: "Incorrect creator group size",
    },
    {
      code: 6014,
      name: "IntegerOverflow",
      msg: "An integer overflowed",
    },
    {
      code: 6015,
      name: "UnintializedGroup",
      msg: "Not all creators have signed to create this group",
    },
    {
      code: 6016,
      name: "UnintializedCollection",
      msg: "Not all creators have signed to create this collection",
    },
  ],
  metadata: {
    address: "9fQse1hBRfzWweeUod6WEsR4jZf7hVucetEheCaWooY5",
  },
}
