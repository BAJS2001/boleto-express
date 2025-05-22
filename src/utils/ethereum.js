// src/utils/ethereum.js
import { ethers } from "ethers";
import CONTRACT_ABI from "./contractABI.json";
import { CONTRACT_ADDRESS } from "./contractAddress";

let provider;
let signer;
let contract;

/**
 * Conecta MetaMask y devuelve { account, balance }.
 * Además inicializa `provider`, `signer` y `contract`.
 */
export async function connectWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask no disponible");
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer   = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const account   = await signer.getAddress();
  const balanceBN = await provider.getBalance(account);
  const balance   = ethers.formatEther(balanceBN);

  return { account, balance };
}

function getContract() {
  if (!contract) throw new Error("connectWallet() no ha sido invocado");
  return contract;
}

/**
 * Mintea un ticket (orig, dest, seat) pagando `priceUsd` en ETH.
 */
export async function mintTicket(origin, destination, seat, priceUsd) {
  const c = getContract();
  // Convertir USD a ETH (ej: divisor 10000, 10 USD -> 0.001 ETH)
  const ethAmount = priceUsd / 10000;
  const tx = await c.mintTicket(origin, destination, seat, {
    value: ethers.parseEther(ethAmount.toString()),
  });

  const receipt = await tx.wait();
  // Parsear logs para encontrar el evento TicketMinted
  const iface = new ethers.Interface(CONTRACT_ABI);
  let tokenId;
  for (const log of receipt.logs) {
    let parsed;
    try {
      parsed = iface.parseLog(log);
    } catch (e) {
      continue;
    }
    if (parsed.name === "TicketMinted") {
      tokenId = parsed.args.tokenId.toString();
      break;
    }
  }
  if (!tokenId) {
    throw new Error("Evento TicketMinted no encontrado");
  }
  return tokenId;
}

export async function verifyTicket(tokenId) {
  const c  = getContract();
  const tx = await c.verifyTicket(tokenId);
  return tx.wait();
}

export async function isUsed(tokenId) {
  const c = getContract();
  return c.isUsed(tokenId);
}

export async function getTicket(tokenId) {
  const c = getContract();
  const [ passenger, origin, destination, seatBN, timestampBN, used ] =
    await c.getTicket(tokenId);

  return {
    passenger,
    origin,
    destination,
    // ethers v6 devuelve bigint para enteros; convertimos a Number
    seat      : Number(seatBN),
    timestamp : Number(timestampBN),
    used,
  };
}
