import axios from 'axios';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class QueueService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async enqueue(type: string, data: object, delay?: number): Promise<{ jobId: string; success: boolean }> {
    const response = await axios.post(`${this.baseUrl}/queue/enqueue`, {
      type,
      data,
      delay
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}