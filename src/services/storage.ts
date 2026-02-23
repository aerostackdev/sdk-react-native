import axios from 'axios';

interface Config {
  apiKey: string;
  baseUrl: string;
}

export class StorageService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async upload(file: Blob, key: string, contentType?: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    if (contentType) formData.append('contentType', contentType);

    const response = await axios.post(`${this.baseUrl}/storage/upload`, formData, {
      headers: { 
        'X-Aerostack-Key': this.apiKey,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}