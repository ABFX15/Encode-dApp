import { Injectable } from '@nestjs/common';
import * as tokenJson from "./assets/MyToken.json";
import { Address, createPublicClient, http, formatEther, createWalletClient, parseEther, GetAddressErrorType } from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<Address>('ALCHEMY_API_KEY');
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
    });
    const account = privateKeyToAccount(`0x${this.configService.get<string>('PRIVATE_KEY')}`);
    this.walletClient = createWalletClient({
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
      chain: sepolia,
      account: account,
    });
  }

  getContractAddress(): Address {
    return this.configService.get<Address>('TOKEN_ADDRESS');
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "name",
    });
    return name as string;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply",
    });
    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol",
    });
    return `${formatEther(totalSupply as bigint)} ${symbol}`;
  }

  async getBalanceOf(address: string) {
    const balanceOf = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address],
    });
    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol",
    });
    return `${formatEther(balanceOf as bigint)} ${symbol}`;
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.publicClient.getTransaction({ hash });
    return `Transaction stztus: ${tx.status}, Block number: ${tx.blockNumber}`;
  }

  async getServerWalletAddress() {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string) {
    const MINTER_ROLE = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "MINTER_ROLE",
    });
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "hasRole",
      args: [MINTER_ROLE, address],
    });
    return `The address ${address} ${hasRole ? "has" : "does not have"} the role ${MINTER_ROLE}`;
  }
  
  async getVotes(address: string): Promise<string>{
    const votes = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "getVotes",
      args: [address],
    });
    return formatEther(votes as bigint);
  }

  async mintTokens(address: string): Promise<any> {
    const minterRole = await this.checkMinterRole(this.walletClient.account.address);
    const mintTx = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "mint",
      args: [address, parseEther("100")],
    });
    const receiptTx = await this.getTransactionReceipt(mintTx.hash);
    const [balance, votes] = await Promise.all([
      this.getBalanceOf(address),
      this.getVotes(address),
    ]);
    console.log(`Minted 100 tokens to ${address}. New balance: ${balance}. Server balance: ${votes}`);
    return {
      minterRole,
      mintTx,
      receiptTx,
      balance,
      votes,  
    };
  }

  async delegateVotes(address: string): Promise<string> {
    const delegateTx = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "delegate",
      args: [address],
    });
    const receiptTx = await this.publicClient.waitForTransactionReceipt({ hash: delegateTx });
    return `Delegated votes to ${address}. Transaction hash: ${delegateTx}`;
  }

  async getPastVotes(address: string, blockNumber: number): Promise<string> {
    const pastVotes = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "getPastVotes",
      args: [address, BigInt(blockNumber)],
    });
    return formatEther(pastVotes as bigint);
  }

}
