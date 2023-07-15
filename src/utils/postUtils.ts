import { Post, PostView } from "lemmy-js-client";
import { isImage } from "./urlUtils";
import { isImgurUrl } from "./imgurUtils";

export type PostType =
  | "Link"
  | "SimpleLink"
  | "Text"
  | "Image"
  | "Video"
  | "Unknown";

export const getPostType = (post: Post): PostType => {
  if (isImagePost(post)) {
    return "Image";
  } else if (isVideoPost(post)) {
    return "Video";
  } else if (isLinkPost(post)) {
    return "Link";
  } else if (isSimpleLinkPost(post)) {
    return "SimpleLink";
  } else if (isTextPost(post)) {
    return "Text";
  }

  return "Unknown";
};

const isImagePost = (post: Post): boolean => {
  return (
    (!!post.thumbnail_url &&
      !!post.url &&
      !post.embed_title &&
      !post.embed_description &&
      !post.embed_video_url) ||
    (!!post.url && (isImage(post.url) || isImgurUrl(post.url)))
  );
};

const isVideoPost = (post: Post): boolean => {
  return !!post.embed_video_url;
};

const isLinkPost = (post: Post): boolean => {
  return !!post.embed_title && !!post.embed_description && !!post.url;
};

const isSimpleLinkPost = (post: Post): boolean => {
  return !!post.url && !isImage(post.url);
};

const isTextPost = (post: Post): boolean => {
  // It is likely to be a text post, so we should fall back to it even if it has an embed title and description.
  // Difficult to tell where they came from, though given there is no URL and no image
  return (
    !post.thumbnail_url &&
    !post.url &&
    // !post.embed_title &&
    // !post.embed_description &&
    !post.embed_video_url
  );
};

export const getPostUrl = (post: PostView): string => {
  return `${post.community.actor_id.replace(
    `/c/${post.community.name}`,
    "/post/"
  )}${post.post.id}`;
};
