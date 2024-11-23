import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/MintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('contract-address')
  getContractAddress() {
    return { result: this.appService.getContractAddress() };
  }

  @Get('token-name')
  async getTokenName() {
    return { result: await this.appService.getTokenName() };
  }

  @Get('total-supply')
  async getTotalSupply() {
    return { result: await this.appService.getTotalSupply() };
  }

  @Get('balance-of/:address')
  async getBalanceOf(@Param('address') address: string) {
    return { result: await this.appService.getBalanceOf(address) };
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return { result: await this.appService.getTransactionReceipt(hash) };
  }

  @Get('server-wallet-address')
  getServerWalletAddress() {
    return { result: this.appService.getServerWalletAddress() };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return { result: await this.appService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    const result = await this.appService.mintTokens(body.address);
    return { result };
  }

  @Get('get-votes')
  async getVotes(@Param('address') address: string) {
    return { result: await this.appService.getVotes(address) };
  }
  
  @Post('delegate-votes/:address')
  async delegateVotes(@Body() body: { address: string }) {
    const result = await this.appService.delegateVotes(body.address);
    return { result };
  }

  @Get('get-past-votes/:address')
  async getPastVotes(@Param('address') address: string, @Query('blockNumber') blockNumber: string) {
    const newBlockNumber = Number(blockNumber);
    return { result: await this.appService.getPastVotes(address, newBlockNumber) };
  }
}
