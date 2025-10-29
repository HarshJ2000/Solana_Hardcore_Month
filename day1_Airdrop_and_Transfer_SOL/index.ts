import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899");

async function main() {
  const userAccount = new Keypair();
  const airdropSol = await connection.requestAirdrop(
    userAccount.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSol);

}

main();
