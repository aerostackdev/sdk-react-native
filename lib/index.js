"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aerostack = exports.AerocallClient = void 0;
const DatabaseService_1 = require("./services/DatabaseService");
const AuthenticationService_1 = require("./services/AuthenticationService");
const CacheService_1 = require("./services/CacheService");
const QueueService_1 = require("./services/QueueService");
const StorageService_1 = require("./services/StorageService");
const AIService_1 = require("./services/AIService");
const ServicesInvocationService_1 = require("./services/ServicesInvocationService");
const RealtimeService_1 = require("./services/RealtimeService");
var core_1 = require("@aerostack/core");
Object.defineProperty(exports, "AerocallClient", { enumerable: true, get: function () { return core_1.AerocallClient; } });
class Aerostack {
    constructor(apiKey, baseUrl = 'https://api.aerostack.ai/v1') {
        if (!apiKey.startsWith('ac_secret_')) {
            throw new Error('Invalid API key provided for Aerostack. Please make sure you are using a valid key.');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.database = new DatabaseService_1.DatabaseService(this.apiKey, this.baseUrl);
        this.authentication = new AuthenticationService_1.AuthenticationService(this.apiKey, this.baseUrl);
        this.cache = new CacheService_1.CacheService(this.apiKey, this.baseUrl);
        this.queue = new QueueService_1.QueueService(this.apiKey, this.baseUrl);
        this.storage = new StorageService_1.StorageService(this.apiKey, this.baseUrl);
        this.ai = new AIService_1.AIService(this.apiKey, this.baseUrl);
        this.servicesInvocation = new ServicesInvocationService_1.ServicesInvocationService(this.apiKey, this.baseUrl);
        this.realtime = new RealtimeService_1.RealtimeService(this.apiKey, this.baseUrl);
    }
}
exports.Aerostack = Aerostack;
