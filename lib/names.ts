export function fifaLeagueName(displayName?: string | null) {
  const cleanName = displayName?.trim();

  if (!cleanName) {
    return "My FIFA World Cup League";
  }

  const suffix = cleanName.endsWith("s") ? "'" : "'s";
  return `${cleanName}${suffix} FIFA World Cup League`;
}
