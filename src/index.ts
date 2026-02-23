import { AuthService } from './services/auth';
import { DatabaseService } from './services/database';
import { CacheService } from './services/cache';
import { QueueService } from './services/queue';
import { StorageService } from './services/storage';
import { AIService } from './services/ai';
import { ServicesInvoker } from './services/servicesInvoker';

export class AerostackSDK {
  public auth: AuthService;
  public database: DatabaseService;
  public cache: CacheService;
  public queue: QueueService;
  public storage: StorageService;
  public ai: AIService;
  public servicesInvoker: ServicesInvoker;

  constructor(private readonly apiKey: string, private readonly baseUrl: string) {
    const config = { apiKey, baseUrl };
    this.auth = new AuthService(config);
    this.database = new DatabaseService(config);
    this.cache = new CacheService(config);
    this.queue = new QueueService(config);
    this.storage = new StorageService(config);
    this.ai = new AIService(config);
    this.servicesInvoker = new ServicesInvoker(config);
  }
}