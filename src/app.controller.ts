// src/sample/sample.controller.ts
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HomeController {
  @Get()
  getHello(@Res() res: Response): void {
    res.status(HttpStatus.OK).json({
      statusDescription: 'PDF Generator API PT Equity Life Indonesia'
    });
  }
}
