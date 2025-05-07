// Stub functions for Ethereum interactions

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{account: string, balance: string}>}
 */
export async function connectWallet() {
  console.log("Connecting to wallet...")

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock successful connection
  const mockAccount = "0x" + Math.random().toString(16).substring(2, 42)
  const mockBalance = (Math.random() * 10).toFixed(4)

  console.log(`Connected to wallet: ${mockAccount}`)
  console.log(`Balance: ${mockBalance} ETH`)

  return {
    account: mockAccount,
    balance: mockBalance,
  }
}

/**
 * Mint a new ticket as NFT
 * @param {string} from Origin
 * @param {string} to Destination
 * @param {number} seat Seat number
 * @returns {Promise<string>} Token ID
 */
export async function mintTicket(from, to, seat) {
  console.log(`Minting ticket: ${from} to ${to}, seat ${seat}`)

  // Simulate delay and transaction processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a random token ID
  const tokenId = Math.floor(Math.random() * 1000000).toString()

  console.log(`Ticket minted successfully. Token ID: ${tokenId}`)

  return tokenId
}

/**
 * Verify if a ticket is valid
 * @param {string} tokenId Token ID
 * @returns {Promise<boolean>} Is valid
 */
export async function verifyTicket(tokenId) {
  console.log(`Verifying ticket with token ID: ${tokenId}`)

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 80% chance of being valid
  const isValid = Math.random() < 0.8

  console.log(`Ticket verification result: ${isValid ? "Valid" : "Invalid"}`)

  return isValid
}

/**
 * Mark a ticket as used
 * @param {string} tokenId Token ID
 * @returns {Promise<boolean>} Success
 */
export async function markTicketAsUsed(tokenId) {
  console.log(`Marking ticket as used: ${tokenId}`)

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Ticket ${tokenId} marked as used`)

  return true
}
