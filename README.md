# @aerostack/sdk-react-native

[![npm version](https://img.shields.io/npm/v/@aerostack/sdk-react-native.svg)](https://www.npmjs.com/package/@aerostack/sdk-react-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The official React Native SDK for Aerostack. Build mobile apps with unified access to authentication, database, caching, storage, AI, and realtime services.

## Features

- **Authentication** — Email/password sign-in, sign-up, and session management
- **Database** — Execute SQL queries against D1 and Postgres
- **Cache** — Key-value caching with TTL, bulk operations, and atomic counters
- **Storage** — Upload, download, and manage files
- **Queue** — Background job scheduling and tracking
- **AI** — Chat completions, vector search, and embeddings
- **Realtime** — WebSocket subscriptions with presence tracking, pub/sub, and chat history
- **Expo Compatible** — No native linking required in managed workflows

## Installation

```bash
npm install @aerostack/sdk-react-native
# or
yarn add @aerostack/sdk-react-native
# or
pnpm add @aerostack/sdk-react-native
```

> **Expo**: This SDK uses standard `fetch` and web-compatible APIs, so it works out of the box with Expo managed workflows — no native linking or ejecting required.

## Quick Start

### Initialize the SDK

```typescript
import { Aerostack } from '@aerostack/sdk-react-native';

const client = new Aerostack({
  projectUrl: 'https://your-project.aerostack.dev',
  apiKey: 'your-public-api-key',
});
```

### Authentication

```typescript
// Sign up a new user
const { user, token } = await client.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
});

// Sign in an existing user
const session = await client.auth.signIn({
  email: 'user@example.com',
  password: 'securePassword123',
});
console.log('Logged in:', session.user.id);
```

### Database Queries

```typescript
// Execute a parameterized query
const users = await client.db.query(
  'SELECT * FROM users WHERE active = ? LIMIT ?',
  [true, 10]
);
```

### Cache Operations

```typescript
// Set a value with TTL
await client.cache.set('session:abc', { userId: '123' }, { ttl: 3600 });

// Retrieve a cached value
const session = await client.cache.get('session:abc');
```

### Storage

```typescript
// Upload a file
await client.storage.upload('avatars/user-123.jpg', fileBlob);

// Get a signed URL
const url = await client.storage.getUrl('avatars/user-123.jpg');
```

### AI Chat

```typescript
const response = await client.ai.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
```

### Realtime Subscriptions

```typescript
// Subscribe to database changes
const channel = client.realtime.channel('todos');

channel.on('INSERT', (payload) => {
  console.log('New todo:', payload);
});

channel.on('UPDATE', (payload) => {
  console.log('Updated todo:', payload);
});

await channel.subscribe();

// Publish custom events
await channel.publish('typing', { userId: 'user-123' });

// Track user presence
await channel.track({ userId: 'user-123', status: 'online' });
```

### Connection Status

```typescript
client.realtime.onStatusChange((status) => {
  // status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  console.log('Realtime status:', status);
});
```

## API Key Management

You can update the API key at runtime (useful after authentication):

```typescript
client.setApiKey('new-api-key');
```

## Error Handling

```typescript
try {
  await client.auth.signIn({ email, password });
} catch (error) {
  if (error.status === 401) {
    console.error('Invalid credentials');
  } else if (error.status === 429) {
    console.error('Rate limited, try again later');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Configuration Options

```typescript
const client = new Aerostack({
  projectUrl: 'https://your-project.aerostack.dev',  // Required
  apiKey: 'your-public-api-key',                       // Required
  maxReconnectAttempts: 10,                             // Realtime reconnection limit (default: Infinity)
});
```

## Related Packages

| Package | Use Case |
|---------|----------|
| [`@aerostack/react`](../react) | React web apps with hooks |
| [`@aerostack/web`](../web) | Vanilla JS browser apps |
| [`@aerostack/node`](../node) | Node.js server-side |
| [`@aerostack/sdk`](../sdk) | Cloudflare Workers (server + client) |

## Documentation

For full documentation, visit [docs.aerostack.dev](https://docs.aerostack.dev/sdk/react-native).

## License

MIT
