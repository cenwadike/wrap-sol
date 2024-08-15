import { Connection, sendAndConfirmTransaction, Signer, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { createCloseAccountInstruction, createSyncNativeInstruction, getOrCreateAssociatedTokenAccount, NATIVE_MINT } from "@solana/spl-token";


export async function wrapSol(
    connection: Connection,
    signer: Signer,
    amount: number
): Promise<TransactionSignature> {
    // wSol ATA 
    const wSolAta = await getOrCreateAssociatedTokenAccount(connection, signer, NATIVE_MINT, signer.publicKey);

    // wrap Sol
    let transaction = new Transaction().add(
        // trasnfer SOL
        SystemProgram.transfer({
          fromPubkey: signer.publicKey,
          toPubkey: wSolAta.address,
          lamports: amount,
        }),
        // sync wrapped SOL balance
        createSyncNativeInstruction(wSolAta.address)
    );

    // submit transaction
    const txSignature = await sendAndConfirmTransaction(connection, transaction, [signer]);

    // validate transaction was successful
    try {
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: txSignature,
        }, 'confirmed');
    } catch (error) {
        console.log(`Error wrapping sol: ${error}`);
    };

    return txSignature;
}

export async function unwrapSol(
    connection: Connection,
    signer: Signer,
): Promise<TransactionSignature> {
    // wSol ATA
    const wSolAta = await getOrCreateAssociatedTokenAccount(connection, signer, NATIVE_MINT, signer.publicKey);

    // close wSol account instruction
    const transaction = new Transaction;
    transaction.add(
        createCloseAccountInstruction(
          wSolAta.address,
          signer.publicKey,
          signer.publicKey
        )
    );

    // submit transaction
    const txSignature = await sendAndConfirmTransaction(connection, transaction, [signer]);

    // validate transaction was successful
    try {
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: txSignature,
        }, 'confirmed');
    } catch (error) {
        console.log(`Error unwrapping sol: ${error}`);
    };

    return txSignature;
}
