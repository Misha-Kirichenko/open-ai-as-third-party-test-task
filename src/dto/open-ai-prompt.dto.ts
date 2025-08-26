import { IsArray, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { MessageDTO } from './message.dto';
import { Type } from 'class-transformer';
import { OpenAIModel } from 'src/enums';

export class OpenAIPromptDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages!: MessageDTO[];

  @IsOptional()
  @IsIn(Object.values(OpenAIModel))
  model?: OpenAIModel;
}
