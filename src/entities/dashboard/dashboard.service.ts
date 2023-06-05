import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "../patient/patient.entity";
import { Repository } from "typeorm";

export class DashboardService {
    @InjectRepository(Patient)
    private readonly patientRepositry: Repository<Patient>

    
}