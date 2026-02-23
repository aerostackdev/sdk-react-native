import axios from 'axios';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class AIService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async chat(model: string, messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<{ response: string }> {
    const response = await axios.post(`${this.baseUrl}/ai/chat`, {
      model,
      messages
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }

  async ingest(content: string, type: string, id?: string, metadata?: object): Promise<{ success: boolean }> {
    const response = await axios.post(`${this.baseUrl}/ai/search/ingest`, {
      content,
      type,
      id,
      metadata
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }

  async query(text: string, topK?: number, types?: string[], filter?: object): Promise<{ results: any[] }> {
    const response = await axios.post(`${this.baseUrl}/ai/search/query`, {
      text,
      topK,
      types,
      filter
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}