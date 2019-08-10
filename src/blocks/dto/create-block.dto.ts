import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class Seal {
  @IsString()
  nonce: string;
  @IsString()
  proof: string;
}
export class Header {
  @IsString()
  parentHash: string;
  @IsString()
  // transactionsRoot: string;
  // @IsString()
  // proposalsHash: string;
  // @IsString()
  // witnessesRoot: string;
  // @IsString()
  // unclesHash: string;
  // @IsString()
  // unclesCount: string;
  // @IsString()
  // // dao: string;
  @IsString()
  difficulty: string;
  @IsString()
  epoch: string;
  @IsString()
  hash: string;
  @IsString()
  number: string;
  @IsString()
  timestamp: string;
  @IsString()
  version: string;
  // seal: Seal;
}

export class CreateBlockDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => Header)
  header: Header;
  // uncles: []
  // transactions: []
}
