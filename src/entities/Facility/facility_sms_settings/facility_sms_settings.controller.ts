import { Controller, Headers,Get, Res, UseGuards } from "@nestjs/common";
import { FacilitiesService } from "../facilities/facilities.service";
import jwtDecode from "jwt-decode";
import { AuthGuard } from "src/guard/auth.guard";

@Controller('facility-sms-settings')
@UseGuards(AuthGuard)
export class FacilitiesSMSController {
  constructor(private facilityService: FacilitiesService) { }

  @Get('/')
  async facilitySmsSettings(
      @Res() res,
      @Headers('Authorization') authHeader: string,
  ) {
      try {
          const token = authHeader.split(' ')[1];
          const loggedInUser: any = jwtDecode(token);
          const facility: any = await this.facilityService.getSingleFacilityById(loggedInUser?.facility_id);
          res.status(200).send(facility)
          return facility;
      }
      catch (e) {
          res.status(404).send({ message: 'Facility Not Found' })
          console.log(e);
      }

  }
}
