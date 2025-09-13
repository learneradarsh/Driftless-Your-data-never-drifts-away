# Driftless

> **Your data never drifts away.**  
> Driftless is a framework-agnostic offline-first sync library with conflict handling and visual sync states.

---

## Features

- Offline-first UX – queue actions offline and auto-sync when back online  
- Persistent storage – built on IndexedDB (with fallbacks)  
- Flexible sync adapters – REST, GraphQL, gRPC (pluggable)  
- Conflict resolution – last-write-wins, merge, or manual user prompt  
- Visual states – built-in hooks/components to show offline, syncing, success, conflict  
- Enterprise-ready – audit logs, GDPR/HIPAA-friendly  
- Framework-agnostic – works with vanilla JS/TS, React, Angular, Vue, Svelte  

---

## Architecture

```
 ┌─────────────┐
 │   Actions   │   User actions (form submit, button click, etc.)
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐
 │   Queue     │   Stored locally (IndexedDB / localStorage)
 └──────┬──────┘
        │
   Offline? Yes ──► Stay queued until connection is back
        │
        ▼
 ┌─────────────┐
 │   Sync      │   Retry logic + adapters (REST, GraphQL, etc.)
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐
 │  Conflict   │   Resolution strategies:
 │             │   - Last write wins
 │             │   - Merge
 │             │   - Ask user
 └──────┬──────┘
        │
        ▼
 ┌─────────────┐
 │   Server    │   Final source of truth
 └─────────────┘
```

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
import { createSync } from "driftless";

const sync = createSync({
  adapter: "rest",
  endpoint: "/api/orders",
});

// Store offline actions
sync.store("order", { id: 1, status: "pending" });

// Listen for sync events
sync.on("status", status => {
  console.log("Sync status:", status);
  // offline, queued, syncing, success, conflict
});
```

---

### React Example

```tsx
import { useSync } from "@driftless/react";

function OrderButton() {
  const { store, status } = useSync("orders");

  return (
    <div>
      <button onClick={() => store({ item: "wifi-pass" })}>
        Buy WiFi
      </button>
      <p>Status: {status}</p>
    </div>
  );
}
```

---

## Conflict Resolution

Driftless supports multiple strategies:

```ts
sync.onConflict((local, remote) => {
  // Example: manual merge
  return {
    ...remote,
    notes: [...remote.notes, ...local.notes]
  };
});
```

---

## Package Structure

- `driftless` → core library (framework-agnostic)  
- `@driftless/react` → React hooks + UI components  
- `@driftless/vue` → Vue composables  
- `@driftless/angular` → Angular service  
- `@driftless/adapters` → REST, GraphQL, Firebase, Supabase, custom  

---

## Use Cases

- **Airlines**: Passenger buys WiFi offline, syncs later, conflict handled if purchased elsewhere  
- **Healthcare**: Nurse logs vitals offline, syncs later, conflict if another nurse updated  
- **Logistics**: Driver scans packages offline, syncs later, conflict if hub already processed  
- **Retail**: Shopper adds items offline, cart merges smoothly when online  

---

## Roadmap

- [ ] Core offline queue + retry  
- [ ] REST adapter  
- [ ] GraphQL adapter  
- [ ] Conflict resolution strategies  
- [ ] React/Vue/Angular bindings  
- [ ] UI components for status & conflict dialogs  
- [ ] Cloud sync connectors (Firebase, Supabase)  

---

## Contributing

Contributions are welcome!  
Please check the issues tab and open a discussion before working on large changes.

---

## License

MIT © Driftless Contributors
