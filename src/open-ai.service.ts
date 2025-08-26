import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAIPromptDTO } from './dto/open-ai-prompt.dto';
import { ConfigService } from '@nestjs/config';
import { OpenAIModel, Role } from './enums';
import { open, access, constants } from 'fs/promises';
import { appendHistory } from './utils';
import { DATA_PATH, HISTORY_FILE_NAME } from './constants';
import { IChatMessage, IHistoryEntry } from './interfaces';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_TOKEN'),
    });
  }

  public async receiveAnswer(
    openAIpromptDTO: OpenAIPromptDTO,
  ): Promise<{ message: string }> {
    const { messages, model } = openAIpromptDTO;
    const response = await this.client.chat.completions.create({
      model: model || OpenAIModel.GPT5,
      messages,
    });

    const aiAnswer = response.choices[0]?.message?.content || '';
    const safeAnswer = aiAnswer.replace(/\n/g, '\\n').replace(/\r/g, '\\r');

    const historyData = {
      prompt: messages[messages.length - 1].content,
      role: messages[messages.length - 1].role,
      answer: safeAnswer,
    };

    await appendHistory(JSON.stringify(historyData) + '\n');

    return { message: safeAnswer };
  }

  public async readLastNMessages(
    n: number,
    bufferSize = 1024,
  ): Promise<IChatMessage[]> {
    const filePath = `${DATA_PATH}/${HISTORY_FILE_NAME}`;
    try {
      await access(filePath, constants.F_OK);
    } catch {
      return [];
    }
    const fileHandle = await open(filePath, 'r');
    const stats = await fileHandle.stat();
    const fileSize = stats.size;

    let position = fileSize;
    let leftover = '';
    const lines: string[] = [];

    while (position > 0 && lines.length < n) {
      const readSize = Math.min(bufferSize, position);
      position -= readSize;

      const { buffer } = await fileHandle.read(
        Buffer.alloc(readSize),
        0,
        readSize,
        position,
      );

      const chunk = buffer.toString('utf-8') + leftover;

      const parts = chunk.split('\n');

      leftover = parts.shift()!;

      for (let i = parts.length - 1; i >= 0 && lines.length < n; i--) {
        lines.unshift(parts[i]);
      }
    }

    if (leftover.trim() && lines.length < n) {
      lines.unshift(leftover);
    }

    await fileHandle.close();

    return lines.reduce<IChatMessage[]>((acc, curr) => {
      if (!curr.trim()) return acc;

      try {
        const parsedData = JSON.parse(curr) as IHistoryEntry;

        const aiAnswer: IChatMessage = {
          role: Role.Assistant,
          content: parsedData.answer
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r'),
        };

        const userPrompt: IChatMessage = {
          role: parsedData.role,
          content: parsedData.prompt,
        };

        acc.push(userPrompt, aiAnswer);
      } catch (_) {
        console.warn('⚠️ Bad JSON line skipped:', curr);
      }

      return acc;
    }, []);
  }
}
