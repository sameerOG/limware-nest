import { Inject } from "@nestjs/common";
import { Donor } from "./donor.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DonorRequestDto } from "./dto/donor.dto";

export class DonorsService {
    @InjectRepository(Donor)
    private readonly donorRepo: Repository<Donor>

    async findDonor(conditions) {
        return await this.donorRepo.findOne({ where: { mobile_number: conditions?.mobile_number } })

    }
    async add(data: DonorRequestDto, facility_id, laboratory_id) {
        const donor = new Donor();
        donor.address = data.address;
        donor.age = data.age;
        donor.age_unit = data.age_unit;
        donor.city = data.city;
        donor.gender = data.gender;
        donor.mobile_number = data.mobile_number;
        donor.name = data.name;
        donor.facility_id = facility_id;
        donor.unique_id = String(Math.floor(Math.random() * 1000000))
        // donor.registration_date = new Date().getTime()
        donor.laboratory_id = laboratory_id;
        return await this.donorRepo.save(donor)
    }
    async getByMobileNumber(mobile_number, facility_id): Promise<Donor | any> {
        const data = await this.donorRepo.findOne({ where: { mobile_number: mobile_number } });
        return data;
    }
    async getAll(queryParams, facility_id,): Promise<Donor[] | any> {
        let donors: any = [];
        donors = await this.donorRepo.query(`
        select * from public.donor
        where facility_id = '${facility_id}'
        order by name ASC;
        `);
        if (queryParams.filter != null && queryParams.filter != undefined) {
            donors = donors?.filter(donor =>
                donor.name.includes(queryParams.filter?.name) ||
                donor.mobile_number.includes(queryParams.filter?.mobile_number) ||
                donor.city.includes(queryParams.filter?.city)
            );
        }
        return donors;
    }
    async getById(id): Promise<Donor | undefined> {
        return await this.donorRepo.query(`select * from public.donor where _id = '${id}'`)
    }
    async delete(id) {
        return await this.donorRepo.query(`delete from public.donor where _id = '${id}'`)
    }
    async update(id, data) {
        const donor = await this.donorRepo.query(`select * from public.donor where _id = '${id}'`)
        if (donor) {
            donor[0].address = data?.address;
            donor[0].age = data?.age;
            donor[0].age_unit = data?.age_unit;
            donor[0].city = data?.city;
            donor[0].gender = data?.gender;
            donor[0].mobile_number = data?.mobile_number;
            donor[0].name = data?.name;
            return await this.donorRepo.save(donor)
        }

    }
}