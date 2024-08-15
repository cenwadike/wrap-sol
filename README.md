# Wrap Sol

`wrap-sol` is a lightweight package for wrapping and unwrapping solana token.

## Overview

`wrap-sol` is a lightweight package for converting **Sol** to **wSol** using javaScript or typeScript. The primary goal behind this project is to provide an ergonomic functions for wrapping and unwrapping **Sol** programmatically.

This in turn allows developers to easily move asset as **Sol** or **wSol** using simple functions.

An example is available here:

```js
import { wrapSol, unwrapSol } from 'wrap-sol';

const connection = new Connection(
    'https://api.mainnet-beta.solana.com', "confirmed"
)


const PRIVATE_KEY = retrieveEnvVariable('PRIVATE_KEY');
const wallet = getWallet(PRIVATE_KEY);
const signer: Signer = {
    publicKey: wallet.publicKey,
    secretKey: wallet.secretKey
} 

wrapSol(connection, signer, LAMPORTS_PER_SOL * 0.00001);

unwrapSol(connection, signer);


// helpers

export function getWallet(wallet: string): Keypair {
  // most likely someone pasted the private key in binary format
  if (wallet.startsWith('[')) {
    const raw = new Uint8Array(JSON.parse(wallet))
    return Keypair.fromSecretKey(raw);
  }

  // most likely someone pasted mnemonic
  if (wallet.split(' ').length > 1) {
    const seed = mnemonicToSeedSync(wallet, '');
    const path = `m/44'/501'/0'/0'`; // we assume it's first path
    return Keypair.fromSeed(derivePath(path, seed.toString('hex')).key);
  }

  // most likely someone pasted base58 encoded private key
  return Keypair.fromSecretKey(bs58.decode(wallet));
}

const retrieveEnvVariable = (variableName: string) => {
    const variable = process.env[variableName] || '';
    if (!variable) {
      console.error(`${variableName} is not set`);
      process.exit(1);
    }
    return variable;
};
```

## Motivation

- Lack of easy to use javaScript/typeScript functions to wrap and unwrap **Sol** token.

## Development status

The package is considered generally complete. It is provided as is and is currently under development and should be considered in the alpha stage.

## Buy me Coffee

If you found this package useful and want to leave a tip, you can send it to the following address: Fj72ApTUaYEwC3RKCKQ7iX3s8i8CVAnZW1f9PAXSKtbY (solana)
