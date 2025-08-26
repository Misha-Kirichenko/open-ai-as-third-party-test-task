import { Injectable } from '@nestjs/common';
import { OpenAIPromptDTO } from './dto/open-ai-prompt.dto';
import { OpenAIService } from './open-ai.service';
import { IChatMessage } from './interfaces';

@Injectable()
export class AppService {
  constructor(private readonly openAIService: OpenAIService) { }

  public async sendMessageToAI(
    openAIpromptDTO: OpenAIPromptDTO,
  ): Promise<{ message: string }> {
    const message = await this.openAIService.receiveAnswer(openAIpromptDTO);
    return message;
  }

  public async getLastNMessages(n: number): Promise<IChatMessage[]> {
    const lastNMessages = await this.openAIService.readLastNMessages(n);
    return lastNMessages;
  }
}
