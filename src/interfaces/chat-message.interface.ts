import { Role } from '../enums';

export interface IChatMessage {
  readonly role: Role;
  readonly content: string;
}
