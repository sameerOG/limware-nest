import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
import { GetAllTestsResponseDto } from './dto/response.dto';
import { LabTestRateListsService } from './lab-test-rate-lists.service';

@Controller('lab-test-rate-lists')
export class LabTestRateListsController {
  constructor(
    private readonly labTestRateListsService: LabTestRateListsService,
  ) {}

  @Post()
  create(@Body() createLabTestRateListDto: any) {
    return this.labTestRateListsService.create(createLabTestRateListDto);
  }

  @Get('/get-all-tests')
  getAllTests(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<GetAllTestsResponseDto> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const data = this.labTestRateListsService.getAllTests(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      throw new HttpException({ err: err, messages: 'Test not found' }, 422);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestRateListsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTestRateListDto: any) {
    return this.labTestRateListsService.update(+id, updateLabTestRateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestRateListsService.remove(+id);
  }
}
