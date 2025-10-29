import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899");

async function main() {
  const senderAccount = new Keypair();
  const receiverAccount = new Keypair();
  const airdropSol = await connection.requestAirdrop(
    senderAccount.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSol);

  const senderAccBal = await connection.getBalance(senderAccount.publicKey);
  console.log(`Sender Account balance: ${senderAccBal}`);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderAccount.publicKey,
      toPubkey: receiverAccount.publicKey,
      lamports: 0.2 * LAMPORTS_PER_SOL,
    })
  );

  console.log("Sending 0.2 SOL to receiver's account....");
  const txnSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [senderAccount]
  );

  console.log("Transaction Successful....");
  console.log(`Transaction Signature.... -> ${txnSignature}`);

  // checking balances of both the sender and receiver after the transaction is complete
  console.log(`Sender's balance: ${senderAccBal}`);
  const receiverAccBal = await connection.getBalance(receiverAccount.publicKey);
  console.log(`Receiver's balance: ${receiverAccBal}`);
}

main();
