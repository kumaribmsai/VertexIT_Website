import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Lightweight password hashing using Node's built-in scrypt (no external dep).
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const computed = scryptSync(password, salt, 64);
    const storedBuf = Buffer.from(hash, "hex");
    if (computed.length !== storedBuf.length) return false;
    return timingSafeEqual(computed, storedBuf);
  } catch {
    return false;
  }
}

// Create a simple sha256 fingerprint for short tokens / IDs (not for passwords).
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
