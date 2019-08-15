import { HttpException, HttpStatus } from '@nestjs/common';
export class BlockForkException extends HttpException {
  constructor(number: number, hash: string) {
    super(
      `Block ${hash} at ${number} forked`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
