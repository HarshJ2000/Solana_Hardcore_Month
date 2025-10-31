import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
const USER_WALLET = new PublicKey(
  "GzFuBZiMVULgjfH128LddGBpv3hmjo7VmQQDeDrDJzxC"
);

const [pda, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("bank"), USER_WALLET.toBuffer()],
  PROGRAM_ID
);

console.log("PDA address: ", pda.toBase58());
console.log("Bump: ", bump);
