// src/utils/ethereum.js
import { ethers } from 'ethers';
import CONTRACT_ABI from './contractABI.json';
import { CONTRACT_ADDRESS } from './contractAddress';

let provider, signer, contract;

/**
 * Conecta MetaMask y devuelve cuenta + balance.
 * Además inicializa `provider`, `signer` y `contract`.
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('Instala MetaMask');
  }
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer   = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const account = await signer.getAddress();
  const balanceBN = await provider.getBalance(account);
  const balance = ethers.utils.formatEther(balanceBN);

  return { account, balance };
}

/**
 * Devuelve la instancia del contrato (debe haber conectado antes).
 */
function getContract() {
  if (!contract) throw new Error('connectWallet() no ha sido invocado');
  return contract;
}

/**
 * Mintea un ticket. Parámetros del formulario: origen, destino, asiento.
 * priceEth es el precio en ETH (p.ej. '0.01').
 */
export async function mintTicket(origin, destination, seat, priceEth) {
  const c = getContract();
  const tx = await c.mintTicket(origin, destination, seat, {
    value: ethers.utils.parseEther(priceEth.toString()),
  });
  const receipt = await tx.wait();
  // Extrae el tokenId desde el evento TicketMinted
  const event = receipt.events.find(e => e.event === 'TicketMinted');
  const tokenId = event.args.tokenId.toString();
  return tokenId;
}

/**
 * Marca un ticket como usado (solo owner). Retorna receipt.
 */
export async function verifyTicket(tokenId) {
  const c = getContract();
  const tx = await c.verifyTicket(tokenId);
  return tx.wait();
}

/**
 * Consulta si un ticket está usado (no gasta gas).
 */
export async function isUsed(tokenId) {
  const c = getContract();
  return await c.isUsed(tokenId);
}

/**
 * Obtiene todos los datos de un ticket (no gasta gas).
 */
export async function getTicket(tokenId) {
  const c = getContract();
  const [passenger, origin, destination, seat, timestamp, used] =
    await c.getTicket(tokenId);
  return { passenger, origin, destination, seat: seat.toNumber(), timestamp: timestamp.toNumber(), used };
}
