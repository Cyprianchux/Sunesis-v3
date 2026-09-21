import type { BoardEntry, Slide, Topic, User } from "./types";

const keys = {
  users: "sunesis_users",
  currentUser: "sunesis_user",
  remembered: "sunesis_remember",
  topics: "sunesis_topics",
  slides: "sunesis_slides",
  board: "sunesisWordBoard",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function hashPassword(value: string) {
  const data = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getUsers() { return read<Record<string, User>>(keys.users, {}); }
export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(keys.currentUser) || (window.localStorage.getItem(keys.remembered) ? window.localStorage.getItem(keys.currentUser) : null);
}
export function setCurrentUser(user: User, remember: boolean) {
  window.sessionStorage.setItem(keys.currentUser, user.username);
  if (remember) {
    window.localStorage.setItem(keys.currentUser, user.username);
    window.localStorage.setItem(keys.remembered, "true");
  }
}
export function logout() {
  window.sessionStorage.clear();
  window.localStorage.removeItem(keys.currentUser);
  window.localStorage.removeItem(keys.remembered);
}
export function saveUser(user: User) {
  const users = getUsers();
  users[user.username] = user;
  write(keys.users, users);
}
export function getTopics() { return read<Topic[]>(keys.topics, []); }
export function saveTopics(value: Topic[]) { write(keys.topics, value); }
export function getSlides() { return read<Slide[]>(keys.slides, []); }
export function saveSlides(value: Slide[]) { write(keys.slides, value); }
export function getBoardEntries() { return read<BoardEntry[]>(keys.board, []); }
export function saveBoardEntries(value: BoardEntry[]) { write(keys.board, value); }
