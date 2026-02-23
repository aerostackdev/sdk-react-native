import axios from 'axios';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class ServicesInvoker {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async invoke(serviceName: string, data: object): Promise<{ success: boolean; result: any }> {
    const response = await axios.post(`${this.baseUrl}/services/invoke`, {
      serviceName,
      data
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}