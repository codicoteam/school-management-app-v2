// Local, browser-only auth used in place of Firebase Auth. Accounts are
// stored in localStorage via the mock "users" collection.

import { addItem, getAll } from "./localDb";
import type { UserRole } from "@/contexts/AuthContext";

export interface MockUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: string;
}

const SESSION_KEY = "mock_auth_session";
const USERS_COLLECTION = "users";

type AuthListener = (user: MockUser | null) => void;
const listeners = new Set<AuthListener>();

function getUsers(): MockUser[] {
  return getAll<MockUser>(USERS_COLLECTION);
}

function findByEmail(email: string) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findByUid(uid: string) {
  return getUsers().find((u) => u.uid === uid) || null;
}

function emitAuthChange(user: MockUser | null) {
  listeners.forEach((listener) => listener(user));
}

export function onAuthStateChangedMock(callback: AuthListener): () => void {
  listeners.add(callback);
  const uid = localStorage.getItem(SESSION_KEY);
  callback(uid ? findByUid(uid) : null);

  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) {
      const currentUid = localStorage.getItem(SESSION_KEY);
      callback(currentUid ? findByUid(currentUid) : null);
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export async function signUpMock(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<MockUser> {
  if (findByEmail(email)) {
    const err: any = new Error("This email is already registered.");
    err.code = "auth/email-already-in-use";
    throw err;
  }
  const uid = `uid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return addItem<Omit<MockUser, "id">>(USERS_COLLECTION, {
    uid,
    name,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  }) as MockUser;
}

export async function signInMock(email: string, password: string): Promise<MockUser> {
  const user = findByEmail(email);
  if (!user) {
    const err: any = new Error("No account found with this email.");
    err.code = "auth/user-not-found";
    throw err;
  }
  if (user.password !== password) {
    const err: any = new Error("Incorrect password. Please try again.");
    err.code = "auth/wrong-password";
    throw err;
  }
  localStorage.setItem(SESSION_KEY, user.uid);
  emitAuthChange(user);
  return user;
}

export async function signOutMock() {
  localStorage.removeItem(SESSION_KEY);
  emitAuthChange(null);
}

export function getCurrentUserMock(): MockUser | null {
  const uid = localStorage.getItem(SESSION_KEY);
  return uid ? findByUid(uid) : null;
}
