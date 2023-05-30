import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { Response } from 'express';
import { ReferencesListResponseDto } from './dto/response.dto';
import jwtDecode from 'jwt-decode';
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  create(@Body() body) {
    return this.referencesService.create(body);
  }

  @Get('/get-all')
  async getAll(
    @Res() response: Response,
    @Headers('Authorization') authHeader: string,
  ): Promise<ReferencesListResponseDto[]> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      let data = await this.referencesService.getAll(loggedInUser);
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'References not found' });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referencesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.referencesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referencesService.remove(+id);
  }
}
