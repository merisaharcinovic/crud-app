import { IsOptional, IsPositive } from "class-validator";

export class PaginationParamsDto{
    @IsOptional()
    @IsPositive()
    readonly page: number = 1;

    @IsOptional()
    @IsPositive()
    readonly per_page: number = 10;
}