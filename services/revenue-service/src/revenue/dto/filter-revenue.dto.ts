import { IsOptional, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterRevenueDto {
  @IsOptional()
  @IsNumber({}, { message: 'Year phải là số' })
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsIn(['total', 'gate'], { message: 'Type phải là total hoặc gate' })
  type?: 'total' | 'gate';
}
