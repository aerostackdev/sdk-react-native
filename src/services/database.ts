import axios from 'axios';
import { DbQueryResult } from '../models/DatabaseModels';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class DatabaseService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async query(sql: string, params?: any[]): Promise<DbQueryResult> {
    const response = await axios.post(`${this.baseUrl}/db/query`, {
      sql,
      params
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}