import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'viem';

export class MintTokenDto {
    @ApiProperty({
        description: 'Ethereum address to mint tokens to',
        example: '0x6d57b739729f83A20D5B38572926BaA53b0F4e97'
    })
    address: Address;

    @ApiProperty({
        description: 'Amount of tokens to mint',
        required: true,
        example: '100'
    })
    amount: string;
}