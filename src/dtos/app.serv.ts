// import { Injectable } from '@nestjs/common';
// import * as tokenJson from "./assets/TokenizedBallot.json";
// import { Address, createPublicClient, http, formatEther, createWalletClient, parseEther, GetAddressErrorType } from 'viem';
// import { sepolia } from 'viem/chains';
// import { ConfigService } from '@nestjs/config';
// import { privateKeyToAccount } from 'viem/accounts';

// @Injectable()
// export class AppService {
//     publicClient;
//     walletClient;

//     constructor(private configService: ConfigService) {
//         const apiKey = this.configService.get<Address>('ALCHEMY_API_KEY');
//         this.publicClient = createPublicClient({
//             chain: sepolia,
//             transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
//         });
//         const account = privateKeyToAccount(`0x${this.configService.get<string>('PRIVATE_KEY')}`);
//         this.walletClient = createWalletClient({
//             transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
//             chain: sepolia,
//             account: account,
//         });
//     }

//     getContractAddress(): Address {
//         return this.configService.get<Address>('TOKEN_ADDRESS');
//     }
    
//     async getVotePower(address: string): Promise<string> {
//         const votePower = await this.publicClient.readContract({
//             address: this.getContractAddress(),
//             abi: tokenJson.abi,
//             functionName: "votePower",
//             args: [address],
//         });
//         return formatEther(votePower as bigint);
//     }

//     async getProposal(index: number): Promise<{ name: string; voteCount: string }> {
//         const proposal = await this.publicClient.readContract({
//             address: this.getContractAddress(),
//             abi: tokenJson.abi,
//             functionName: "proposals",
//             args: [index],
//         });
//         return {
//             name: proposal[0],
//             voteCount: formatEther(proposal[1] as bigint),
//         };
//     }

//     async vote(proposal: number, amount: string): Promise<string> {
//         const voteTx = await this.walletClient.writeContract({
//             address: this.getContractAddress(),
//             abi: tokenJson.abi,
//             functionName: "vote",
//             args: [proposal, parseEther(amount)],
//         });
//         return voteTx;
//     }

//     async getVotePowerSpent(address: string): Promise<string> {
//         const votePowerSpent = await this.publicClient.readContract({
//             address: this.getContractAddress(),
//             abi: tokenJson.abi,
//             functionName: "votePowerSpent",
//             args: [address],
//         });
//         return formatEther(votePowerSpent as bigint);
//     }
// }