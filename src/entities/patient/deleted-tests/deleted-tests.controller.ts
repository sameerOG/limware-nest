import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { DeletedTestsService } from './deleted-tests.service';
import { Response } from 'express';
import jwtDecode from 'jwt-decode';
@Controller('deleted-tests')
export class DeletedTestsController {
  constructor(private deleteTestService: DeletedTestsService) {}

  @Get('/')
  async getAssignedPatients(
    @Res() response: Response,
    @Query() query,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    try {
      const token = authHeader.split(' ')[1];
      const loggedInUser = jwtDecode(token);
      const perpage = query['per-page'] ? query['per-page'] : 25;
      const page = query['page'] ? query['page'] : 1;
      const sort = query['sort'];
      const text = query.filter;
      const skip = (page - 1) * perpage;

      let data = await this.deleteTestService.getDeleteTests(
        loggedInUser,
        skip,
        perpage,
        text,
        sort,
      );
      response.status(200).send(data);
      return data;
    } catch (err) {
      console.log('err in catch', err);
      response
        .status(422)
        .send({ error: err, message: 'Deleted Tests not found' });
    }
  }
}
