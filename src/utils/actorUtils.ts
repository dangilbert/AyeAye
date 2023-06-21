export const getShortActorId = (actorId?: string): string | undefined => {
  if (!actorId) {
    return undefined;
  }
  return new URL(actorId).hostname;
};

export const getActorIdFromUrl = (url: string): string | undefined => {
  const urlObject = new URL(url);
  const pathSegments = urlObject.pathname.split("/");
  if (url.includes("/c/")) {
    return `!${pathSegments[pathSegments.length - 1]}@${urlObject.hostname}`;
  } else if (url.includes("/u/")) {
    return `@${pathSegments[pathSegments.length - 1]}@${urlObject.hostname}`;
  }
  return urlObject.hostname;
};
