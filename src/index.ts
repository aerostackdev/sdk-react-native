import { AuthService } from './services/auth';
import { DatabaseService } from './services/database';
import { CacheService } from './services/cache';
import { QueueService } from './services/queue';
import { StorageService } from './services/storage';
import { AIService } from './services/ai';
import { ServicesInvoker } from './services/servicesInvoker';
import { RealtimeService } from './services/RealtimeService';

// Re-export realtime types and hooks
export { RealtimeService } from './services/RealtimeService';
export type { RealtimeEvent, RealtimeSubscriptionOptions, RealtimeStatus, RealtimeCallback } from './services/RealtimeService';
export { useSubscription, useRealtimeStatus } from './hooks/useSubscription';

export class AerostackSDK {
  public auth: AuthService;
  public database: DatabaseService;
  public cache: CacheService;
  public queue: QueueService;
  public storage: StorageService;
  public ai: AIService;
  public servicesInvoker: ServicesInvoker;
  public realtime: RealtimeService;

  constructor(private readonly apiKey: string, private readonly baseUrl: string, projectId: string = '') {
    const config = { apiKey, baseUrl };
    this.auth = new AuthService(config);
    this.database = new DatabaseService(config);
    this.cache = new CacheService(config);
    this.queue = new QueueService(config);
    this.storage = new StorageService(config);
    this.ai = new AIService(config);
    this.servicesInvoker = new ServicesInvoker(config);
    this.realtime = new RealtimeService(apiKey, baseUrl, projectId);
  }
}