import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmailTemplatesDto } from '../dto/email-templates/response.dto';
import { EmailTemplatesService } from './email-templates.service';
import { Response } from 'express';
import { EmailTemplateRequestDto } from '../dto/email-templates/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
@Controller('email-templates')
@UseGuards(AuthGuard)
export class EmailTemplatesController {
  constructor(private emailTemplateService: EmailTemplatesService) {}

  @Get('/')
  async getAll(
    @Res() response: Response,
    @Query() query,
  ): Promise<EmailTemplatesDto[]> {
    try {
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter?.title;
      const skip = (page - 1) * perpage;

      let data = await this.emailTemplateService.getAll(
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Templates not found' });
    }
  }

  @Get('/:id')
  async getSingle(@Res() response: Response, @Param('id') id): Promise<any> {
    try {
      let data = await this.emailTemplateService.getSingle(id);
      response.status(200).send(data);
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Template not found' });
    }
  }

  @Post('/')
  async add(
    @Res() response: Response,
    @Body() body: EmailTemplateRequestDto,
  ): Promise<EmailTemplatesDto> {
    try {
      let data = await this.emailTemplateService.add(body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Template not added' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response.status(422).send({ error: err, message: 'Template not added' });
    }
  }

  @Put('/:id')
  async update(
    @Res() response: Response,
    @Body() body: EmailTemplateRequestDto,
    @Param('id') id: string,
  ): Promise<EmailTemplatesDto> {
    try {
      let data = await this.emailTemplateService.update(id, body);
      if (data) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Template not updated' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Template not updated' });
    }
  }

  @Delete('/:id')
  async delete(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      let data = await this.emailTemplateService.delete(id);
      if (data.affected > 0) {
        response.status(200).send(data);
        return data;
      } else {
        throw new HttpException(
          { err: true, messages: 'Template not deleted' },
          422,
        );
      }
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Template not deleted' });
    }
  }
}
