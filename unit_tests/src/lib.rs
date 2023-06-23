use std::{error::Error, path::Path, sync::Arc};

use anchor_client::{
    solana_client::nonblocking::rpc_client::RpcClient,
    solana_sdk::{
        hash::Hash,
        pubkey::Pubkey,
        signature::{read_keypair_file, Keypair},
        signer::Signer,
        system_transaction::transfer,
    },
    Client, Cluster, Program,
};

pub mod minter;
pub mod unit;
pub mod zk;

pub const DEVKEY: &str = "../dev.json";

pub const CLUSTER: Cluster = Cluster::Localnet;

pub fn setup(devkey: impl AsRef<Path>, cluster: Cluster, program: Pubkey) -> Test {
    let devkey = Arc::new(
        read_keypair_file(devkey.as_ref())
            .unwrap_or_else(|_| panic!("invalid dev_key: {}", devkey.as_ref().display())),
    );
    let rpc = RpcClient::new_with_commitment(
        cluster.url().to_string(),
        anchor_client::solana_sdk::commitment_config::CommitmentConfig {
            commitment: anchor_client::solana_sdk::commitment_config::CommitmentLevel::Processed,
        },
    );
    let client = Client::new(cluster, Arc::clone(&devkey));
    let program = client.program(program);

    Test {
        client,
        devkey,
        program,
        rpc,
    }
}

#[allow(unused)]
pub struct Test {
    client: Client<Arc<Keypair>>,
    devkey: Arc<Keypair>,
    program: Program<Arc<Keypair>>,
    rpc: RpcClient,
}

impl Test {
    pub async fn fund_user(&self, lamports: u64) -> Result<User, Box<dyn Error>> {
        // Generate a new keypair for the user
        let keypair = Keypair::new();

        // Fund the user
        let transfer_tx = transfer(
            &self.devkey,
            &keypair.pubkey(),
            lamports,
            self.rpc.get_latest_blockhash().await?,
        );
        self.rpc.send_and_confirm_transaction(&transfer_tx).await?;

        Ok(User { keypair })
    }

    pub async fn blockhash(&self) -> Result<Hash, Box<dyn Error>> {
        Ok(self.rpc.get_latest_blockhash().await?)
    }
}

#[derive(Debug)]
pub struct User {
    pub keypair: Keypair,
}

impl User {
    pub fn pubkey(&self) -> Pubkey {
        self.keypair.pubkey()
    }
}
