import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

const FILE = 'messages.json';

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const messages = await this.findAll();
    return messages[id];
  }

  async findAll() {
    const contents = await readFile(FILE, 'utf8');
    const messages = JSON.parse(contents);
    return messages;
  }

  async create(content: string) {
    const messages = await this.findAll();
    const id = Date.now();
    messages[id] = { id, content };
    await writeFile(FILE, JSON.stringify(messages));
  }
}
