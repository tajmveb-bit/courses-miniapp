const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function command(args: (string | number)[]): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error("Upstash Redis is not configured");
  }
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    throw new Error(`Redis request failed: ${res.status}`);
  }
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

export const redis = {
  get: (key: string) => command(["GET", key]) as Promise<string | null>,
  set: (key: string, value: string) => command(["SET", key, value]),
  // Atomically sets the key only if it doesn't already exist — returns "OK" on first
  // success, null if the key was already set (used to enforce single-use codes).
  setNx: (key: string, value: string) => command(["SET", key, value, "NX"]) as Promise<"OK" | null>,
};
