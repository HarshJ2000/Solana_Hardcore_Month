// Script to print AccountInfo of a publickey of an account 
import { Connection, Keypair } from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899");
const keypair = new Keypair();

const publicKey = keypair.publicKey;

(async () => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  console.log("Account info: ", accountInfo);
  console.log("Account publicKey-> ", publicKey.toBase58());
})();


