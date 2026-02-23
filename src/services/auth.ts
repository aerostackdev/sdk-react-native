import axios from 'axios';
import { AuthResponse } from '../models/authModels';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class AuthService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async signup(email: string, password: string, name?: string, metadata?: object): Promise<AuthResponse> {
    const response = await axios.post(`${this.baseUrl}/auth/signup`, {
      email,
      password,
      name,
      metadata
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }

  async signin(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${this.baseUrl}/auth/signin`, {
      email,
      password
    }, {
      headers: { 'X-Aerostack-Key': this.apiKey }
    });
    return response.data;
  }
}