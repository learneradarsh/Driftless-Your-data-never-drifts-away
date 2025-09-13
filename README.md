# Driftless

> **Your data never drifts away.**  
> Driftless is a framework-agnostic offline-first sync library with conflict handling and visual sync states.

---

## Features

- Offline-first UX – queue actions offline and auto-sync when back online
- Persistent storage – built on IndexedDB with UUID-based IDs
- Flexible sync adapters – REST available today, GraphQL & gRPC planned
- Conflict resolution – configurable via `onConflict` handler, supports:
  - Last-write-wins
  - Merge strategies
  - Manual user prompt
- Visual states – built-in hooks/components to show offline, queued, syncing, success, conflict
- Framework-agnostic – works with vanilla JS/TS, React, Angular, Vue, Svelte
- Enterprise-ready (planned) – audit logs, compliance helpers

---

## Architecture

![Architecture Diagram](https://drive.google.com/file/d/1Lw22kdV4y9TR1Fi6gEOfgUhqWfySDHD3/view?usp=sharing)

---

## Installation

```bash
npm install driftless
# or
yarn add driftless
# or
pnpm add driftless
```

Optional framework bindings:

```bash
npm install @driftless/react
npm install @driftless/vue
npm install @driftless/angular
```

---

## Usage

### Core API

```ts
import { createSync } from 'driftless';
import { createRestAdapter } from 'driftless';

const adapter = createRestAdapter({ endpoint: '/api/orders' });

const sync = createSync({
  adapter,
  pollIntervalMs: 5000,
});

// Store offline actions
sync.store('order', { id: 1, status: 'pending' });

// Listen for sync events
sync.on('status', (status) => {
  console.log('Sync status:', status);
  // offline, queued, syncing, success, conflict
});
```

---

### React Example

```tsx
import { useSync } from '@driftless/react';

function OrderButton() {
  const { store, status } = useSync('orders', '/api/orders');

  return (
    <div>
      <button onClick={() => store({ item: 'wifi-pass' })}>Buy WiFi</button>
      <p>Status: {status}</p>
    </div>
  );
}
```

---

## Conflict Resolution

Driftless supports custom resolution strategies via the `onConflict` API:

```ts
sync.onConflict((local, remote) => {
  // Example: manual merge
  return {
    ...remote,
    notes: [...remote.notes, ...local.notes],
  };
});
```

If no handler is registered, Driftless emits a `conflict` event so the app can decide.

---

## Package Structure

- `driftless` → core library (framework-agnostic)
- `@driftless/react` → React hooks + UI components
- `@driftless/vue` → Vue composables
- `@driftless/angular` → Angular service
- `@driftless/adapters` → REST (available), GraphQL/Firebase/Supabase (planned)

---

## Use Cases

- **Airlines**: Passenger buys WiFi offline, syncs later, conflict handled if purchased elsewhere
- **Healthcare**: Nurse logs vitals offline, syncs later, conflict if another nurse updated
- **Logistics**: Driver scans packages offline, syncs later, conflict if hub already processed
- **Retail**: Shopper adds items offline, cart merges smoothly when online

---

## Roadmap

- [x] Core offline queue + retry (IndexedDB)
- [x] REST adapter
- [x] Conflict resolution strategies
- [ ] React/Vue/Angular bindings
- [ ] UI components for status & conflict dialogs
- [ ] GraphQL adapter
- [ ] Cloud sync connectors (Firebase, Supabase)
- [ ] Enterprise features (audit logs, compliance)

---

## Release Notes

**v0.1.0**

- Initial release
- IndexedDB queue with UUIDs
- REST adapter
- Conflict resolution API
- React hook (`useSync`)

---

## Contributing

Contributions are welcome!  
Please check the issues tab and open a discussion before working on large changes.

---

## License

MIT © Driftless Contributors
