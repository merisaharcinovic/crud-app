import { IsOptional, IsPositive, IsNumber } from "class-validator";

export class PaginatedResponseDto<T> {
    _meta: MetaDataDto;
    list: Array<T>;
  }
  
  export class MetaDataDto {
    @IsOptional()
    @IsPositive()
    page: number;
  
    @IsOptional()
    @IsPositive()
    per_page: number;
  
    @IsOptional()
    @IsNumber()
    total: number;
  }