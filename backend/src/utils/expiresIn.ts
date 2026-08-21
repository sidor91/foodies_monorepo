const EXPIRES_IN_UNITS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function parseExpiresInMs(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) {
    throw new Error(`Unsupported expiresIn format: ${expiresIn}`);
  }

  const [, amount, unit] = match;
  return Number(amount) * EXPIRES_IN_UNITS[unit as string];
}
