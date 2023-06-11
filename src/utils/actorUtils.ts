export const getShortActorId = (actorId?: string): string | undefined => {
  if (!actorId) {
    return undefined;
  }
  return new URL(actorId).hostname;
};
