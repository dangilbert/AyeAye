export const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
};

export const isYoutubeUrl = (url?: string): boolean => {
  return !!url && (url.includes("youtube") || url.includes("youtu.be"));
};

export const urlHost = (url: string) => {
  return new URL(url).host;
};
