import { IsBoolean } from "class-validator";

export class LaboratoriesSettingsDto {
    
    @IsBoolean()
    require_results_for_mark_as_done!: boolean;

    @IsBoolean()
    print_empty_result!: boolean

}