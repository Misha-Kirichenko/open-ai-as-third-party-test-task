import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIPromptDTO } from './dto/open-ai-prompt.dto';
import { IChatMessage } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/ai')
  sendMessageToAI(
    @Body() openAIpromptDTO: OpenAIPromptDTO,
  ): Promise<{ message: string }> {
    return this.appService.sendMessageToAI(openAIpromptDTO);
  }

  @Get('/ai/last-messages/:n')
  getLastNMessages(
    @Param('n', ParseIntPipe) n: number,
  ): Promise<IChatMessage[]> {
    return this.appService.getLastNMessages(n);
  }
}
