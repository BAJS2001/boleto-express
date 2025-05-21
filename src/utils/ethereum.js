// src/utils/ethereum.js
import { ethers } from 'ethers';
import CONTRACT_ABI from './contractABI.json';
import { CONTRACT_ADDRESS } from './contractAddress';

let provider;
let signer;
let contract;

/**
 * Conecta MetaMask, pide permisos y devuelve account + balance.
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask no está instalado');
  }
  // Solicita acceso
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer   = provider.getSigner();
  const account = await signer.getAddress();
  const balanceBN = await provider.getBalance(account);
  const balance   = ethers.utils.formatEther(balanceBN);

  // Una vez conectados, inicializa el contrato
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return { account, balance, provider, signer, contract };
}

/**
 * Devuelve la instancia del contrato (ya inicializada tras connectWallet).
 */
export function getContract() {
  if (!contract) {
    throw new Error('Primero debes conectar la wallet con connectWallet()');
  }
  return contract;
}

/**
 * Simula el mint de un ticket (asume que connectWallet ya inicializó `contract`).
 */
export async function mintTicket(origin, destination, seat, departureTime, priceInEth) {
  const c = getContract();
  const tx = await c.mintTicket(
    await signer.getAddress(),
    origin,
    destination,
    seat,
    departureTime,
    { value: ethers.utils.parseEther(priceInEth.toString()) }
  );
  return tx.wait();
}

/**
 * Simula la verificación de un ticket (solo owner puede llamar).
 */
export async function verifyTicket(tokenId) {
  const c = getContract();
  const tx = await c.verifyTicket(tokenId);
  return tx.wait();
}
