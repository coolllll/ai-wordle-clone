import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { dataDirectory, StorageError, writeJsonAtomic } from "./storage";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 32;

export interface PublicAccount {
  id: string;
  username: string;
}

interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  passwordSalt: string;
}

interface UserStore {
  users: UserRecord[];
}

export class AccountError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AccountError";
    this.status = status;
  }
}

let queue: Promise<void> = Promise.resolve();

export function usersFile(): string {
  return path.join(dataDirectory(), "users.json");
}

export async function registerAccount(
  username: string,
  password: string,
): Promise<PublicAccount> {
  const normalized = normalizeCredentials(username, password);
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(normalized.password, passwordSalt);
  const record: UserRecord = {
    id: crypto.randomUUID(),
    username: normalized.username,
    passwordHash,
    passwordSalt,
  };

  await updateUsers((store) => {
    if (store.users.some((user) => user.username === record.username)) {
      throw new AccountError(409, "That username is already in use.");
    }
    store.users.push(record);
    return store;
  });

  return toPublic(record);
}

export async function authenticate(
  username: string,
  password: string,
): Promise<PublicAccount> {
  const normalized = normalizeCredentials(username, password);
  const store = await readUsers();
  const user = store.users.find(
    (item) => item.username === normalized.username,
  );
  const matches =
    user !== undefined &&
    (await verifyPassword(
      normalized.password,
      user.passwordHash,
      user.passwordSalt,
    ));
  if (!user || !matches) {
    throw new AccountError(401, "The username or password is incorrect.");
  }
  return toPublic(user);
}

export async function findAccountById(
  id: string,
): Promise<PublicAccount | null> {
  const store = await readUsers();
  const user = store.users.find((item) => item.id === id);
  return user ? toPublic(user) : null;
}

function normalizeCredentials(
  username: string,
  password: string,
): { username: string; password: string } {
  const normalizedUsername = username.trim();
  if (normalizedUsername.length === 0 || password.length === 0) {
    throw new AccountError(400, "Username and password are required.");
  }
  return { username: normalizedUsername, password };
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return derived.toString("hex");
}

async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}

function toPublic(user: UserRecord): PublicAccount {
  return { id: user.id, username: user.username };
}

async function readUsers(): Promise<UserStore> {
  try {
    const text = await fs.readFile(usersFile(), "utf8");
    return parseUsers(JSON.parse(text));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const empty: UserStore = { users: [] };
      await writeJsonAtomic(usersFile(), empty);
      return empty;
    }
    if (error instanceof StorageError || error instanceof SyntaxError) {
      throw new StorageError(
        "malformed",
        "Saved game data is invalid and was not changed.",
      );
    }
    throw error;
  }
}

function updateUsers(
  mutator: (store: UserStore) => UserStore,
): Promise<UserStore> {
  const run = queue.then(async () => {
    const current = await readUsers();
    const next = parseUsers(mutator(structuredClone(current)));
    await writeJsonAtomic(usersFile(), next);
    return next;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function parseUsers(value: unknown): UserStore {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as UserStore).users)
  ) {
    throw new StorageError(
      "malformed",
      "Saved game data is invalid and was not changed.",
    );
  }
  const users = (value as UserStore).users;
  if (
    !users.every(
      (user) =>
        user &&
        typeof user.id === "string" &&
        user.id.length > 0 &&
        typeof user.username === "string" &&
        user.username.length > 0 &&
        typeof user.passwordHash === "string" &&
        user.passwordHash.length > 0 &&
        typeof user.passwordSalt === "string" &&
        user.passwordSalt.length > 0,
    )
  ) {
    throw new StorageError(
      "malformed",
      "Saved game data is invalid and was not changed.",
    );
  }
  return { users };
}
