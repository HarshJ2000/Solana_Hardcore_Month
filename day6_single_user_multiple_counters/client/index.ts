import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import fs from "fs";
import * as borsh from "borsh";

async function main() {
  const PROGRAM_ID = new PublicKey(
    "<replace this with our solana program's ProgramID>"
  );

  const payer = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(fs.readFileSync("~/.config/solana/id.json", "utf-8"))
    )
  );

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  class Counter {
    owner!: Uint8Array;
    count!: number;
    id!: number;
  }

  const counterSchema: Map<any, any> = new Map([
    [
      Counter,
      {
        kind: "struct",
        fields: [
          ["count", "u32"],
          ["owner", [32]],
        ],
      },
    ],
  ]);

  let id = 1;

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), payer.publicKey.toBuffer(), Uint8Array.of(id)],
    PROGRAM_ID
  );

  const instructionData = Buffer.from([2, id]);

  const txn = new Transaction().add({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: false },
      { pubkey: pda, isSigner: false, isWritable: true },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });

  await sendAndConfirmTransaction(connection, txn, [payer]);

  const accountInfo = await connection.getAccountInfo(pda);
  if (!accountInfo) {
    console.error("❌ Counter account not found on-chain.");
    return;
  }

  const counter = borsh.deserialize(counterSchema, Counter, accountInfo.data);
  console.log("Counter value: ", counter.count);
}

main();
