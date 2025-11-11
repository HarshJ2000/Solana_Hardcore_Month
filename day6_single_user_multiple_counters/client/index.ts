import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";

const PROGRAM_ID = new PublicKey(
  "<replace this with the solana program ProgramID>"
);

const payer = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(fs.readFileSync("~/.config/solana/id.json", "utf-8"))
  )
);

const connection = new Connection("http://127.0.0.1:8899");