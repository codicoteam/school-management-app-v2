// Lightweight localStorage-backed mock database used to replace Firestore
// for everything except the admin dashboard analytics (which still reads
// live data from Firebase).

type Listener<T> = (items: T[]) => void;

const listenersMap = new Map<string, Set<Listener<any>>>();

function collectionKey(name: string) {
  return `mockdb_${name}`;
}

function docKey(name: string, key: string) {
  return `mockdoc_${name}_${key}`;
}

function read<T>(name: string): T[] {
  try {
    const raw = localStorage.getItem(collectionKey(name));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(name: string, items: T[]) {
  localStorage.setItem(collectionKey(name), JSON.stringify(items));
  listenersMap.get(name)?.forEach((listener) => listener(items));
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getAll<T>(name: string): T[] {
  return read<T>(name);
}

/** Subscribe to a collection, mimicking Firestore's onSnapshot. */
export function subscribe<T>(name: string, callback: Listener<T>): () => void {
  if (!listenersMap.has(name)) listenersMap.set(name, new Set());
  listenersMap.get(name)!.add(callback);
  callback(read<T>(name));

  const onStorage = (e: StorageEvent) => {
    if (e.key === collectionKey(name)) callback(read<T>(name));
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listenersMap.get(name)?.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function addItem<T extends object>(name: string, data: T): T & { id: string } {
  const items = read<any>(name);
  const item = { id: genId(), ...data };
  items.push(item);
  write(name, items);
  return item;
}

export function updateItem<T extends object>(name: string, id: string, data: Partial<T>) {
  const items = read<any>(name);
  const idx = items.findIndex((i: any) => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...data };
  write(name, items);
}

export function deleteItem(name: string, id: string) {
  const items = read<any>(name).filter((i: any) => i.id !== id);
  write(name, items);
}

/** Single-document "collections" (e.g. system settings). */
export function getDocValue<T>(name: string, key: string): T | null {
  try {
    const raw = localStorage.getItem(docKey(name, key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setDocValue<T>(name: string, key: string, value: T) {
  localStorage.setItem(docKey(name, key), JSON.stringify(value));
}
