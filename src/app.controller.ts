import { Body, Controller, Param, Post, Get, Req, StreamableFile } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import BSON from 'bson';
import * as lzma from '../lib/lzma';
import { ParserService } from './parser.service';

@Controller()
export class AppController {
  private dict;

  constructor(private parserService: ParserService) {
    this.dict = {};
  }

  @Post('id/:id')
  @ApiBody({ description: 'Json to convert' })
  parse(@Param('id') id: string, @Body() body) {
    const obj = body;
    const neosObj = this.parserService.jsonToSlots(obj, id);
    const bson = this.toBson(neosObj);
    this.dict[id] = bson;
    const input = Buffer.from(bson);
    const output = Buffer.from(lzma.compress(Buffer.from(input), 5));
    return new StreamableFile(output);
  }

  @Get('id/:id')
  getData(@Param('id') id: string) {
    const neosBsonObj = this.dict[id];
    if (neosBsonObj) {
      const input = Buffer.from(neosBsonObj);
      const output = Buffer.from(lzma.compress(Buffer.from(input), 5));
      return new StreamableFile(output);
    }

    return null;
  }

  private toBson(obj: any) {
    return BSON.serialize(obj);
  }
}
