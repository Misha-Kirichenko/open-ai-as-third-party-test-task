import { IsIn, IsString } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class MessageDTO {
  @IsIn(Object.values(Role))
  role!: Role;

  @IsString()
  content!: string;
}
