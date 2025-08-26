import { Role } from 'src/enums';

export interface IHistoryEntry {
  readonly prompt: string;
  readonly model: string;
  readonly answer: string;
  readonly role: Role;
}
