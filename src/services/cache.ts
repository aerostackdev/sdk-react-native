import axios from 'axios';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class CacheService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async get(key: string): Promise<{ value: any; exists: boolean }> {
    const response = await axios.post(`${this.baseUrl}/cache/get`, {
      key
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }

  async set(key: string, value: any, ttl?: number): Promise<{ success: boolean }> {
    const response = await axios.post(`${this.baseUrl}/cache/set`, {
      key,
      value,
      ttl
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}