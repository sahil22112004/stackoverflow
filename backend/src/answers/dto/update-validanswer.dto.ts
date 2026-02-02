import { IsUUID, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

export class updateanswervalidDto {
  @IsUUID()
  id: string

  @IsBoolean()
  isValid:boolean

}
