async function claimMultipleIfEligible(contract, user_address) {
  const eligiblePresales = []; // Array to store eligible presale indices

  // Get the number of presales
  const presaleCount = await contract.presaleId();

  // Iterate through each presale
  for ( let i = 1, i <= presaleCount; i++ ) {
    // Check if the presale is enabled for claiming
    const isEnableClaim = await contract.presale(i).isEnableClaim(i);

    if (isEnableClaim) {
      // Check the claimable amount for the user
      const claimableAmount = await contract.claimableAmount(i, user_address);

      // Only add to the eligible array if there is a non-zero amount to claim
      if (claimableAmount > 0) {
        eligiblePresales.push(i + 1); // Add presale index to the eligible array
        console.log(`Presale ${i} is eligible for claiming`);
      } else {
        console.log(`No claimable amount for presale ${i}`);
      }
    } else {
      console.log(`Presale ${i} is not enabled for claiming`);
    }
  }

  // Call a separate function to handle the claim multiple transaction
  await claimMultiple(contract, user_address, eligiblePresales);
}

async function claimMultiple(contract, user_address, eligiblePresales) {
  // Perform claim multiple transaction with the eligible presales array
  await contract.claimMultiple(eligiblePresales, { from: user_address });
  console.log(`Claimed tokens for presales: ${eligiblePresales.join(", ")}`);
}
