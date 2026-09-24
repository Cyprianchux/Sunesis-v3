import { afterEach, describe, expect, it } from "vitest";
import {
  getBoardEntries,
  getCurrentUser,
  getSlides,
  getTopics,
  getUsers,
  logout,
  saveBoardEntries,
  saveSlides,
  saveTopics,
  saveUser,
  setCurrentUser,
} from "../../lib/storage";
import type { User } from "../../lib/types";

class MemoryStorage {
  private values = new Map<string, string>();

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const sessionStorage = new MemoryStorage();
const localStorage = new MemoryStorage();

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

Object.assign(globalThis, { window: { sessionStorage, localStorage } });

describe("browser storage helpers", () => {
  const user: User = {
    username: "learner",
    email: "learner@example.com",
    passwordHash: "hash",
    role: "user",
    verified: true,
  };

  it("persists users and content collections", () => {
    saveUser(user);
    saveTopics([{ name: "Math", creator: "learner", createdAt: "2026-01-01" }]);
    saveSlides([
      { id: "slide-1", topic: "Math", title: "One", description: "Two", creator: "learner" },
    ]);
    saveBoardEntries([{ id: "entry-1", content: "Note", createdAt: "2026-01-01" }]);

    expect(getUsers()).toEqual({ learner: user });
    expect(getTopics()).toHaveLength(1);
    expect(getSlides()[0].title).toBe("One");
    expect(getBoardEntries()[0].content).toBe("Note");
  });

  it("supports remembered and session-only users", () => {
    setCurrentUser(user, true);
    expect(getCurrentUser()).toBe("learner");
    logout();
    expect(getCurrentUser()).toBeNull();

    setCurrentUser(user, false);
    expect(getCurrentUser()).toBe("learner");
    localStorage.clear();
    sessionStorage.clear();
    expect(getCurrentUser()).toBeNull();
  });
});
