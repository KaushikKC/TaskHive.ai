const { web3 } = require("@solana/web3.js");

const initiateCryptoPayment = async (recipientWallet, amount, token) => {
  try {
    // Validate payment with AI
    const aiValidation = await axios.post(
      `${process.env.AI_AGENT_URL}/validate-payment`,
      { recipientWallet, amount, token }
    );

    if (!aiValidation.data.isValid) {
      throw new Error(aiValidation.data.reason);
    }

    // Create and send transaction
    const transaction = await createSolanaTransaction(
      recipientWallet,
      amount,
      token
    );

    const result = await web3.sendAndConfirmTransaction(transaction);

    // Log for AI learning
    await axios.post(`${process.env.AI_AGENT_URL}/log-transaction`, {
      type: "CRYPTO_TRANSFER",
      recipient: recipientWallet,
      amount,
      token,
      transaction: result,
    });

    return {
      status: "success",
      transactionId: result,
      confirmation: result.confirmationTime,
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    throw new Error("Failed to process payment");
  }
};

module.exports = { initiateCryptoPayment };
