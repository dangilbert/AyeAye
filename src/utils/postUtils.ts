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
  if (isTextPost(post)) {
    return "Text";
  } else if (isImagePost(post)) {
    return "Image";
  } else if (isVideoPost(post)) {
    return "Video";
  } else if (isLinkPost(post)) {
    return "Link";
  } else if (isSimpleLinkPost(post)) {
    return "SimpleLink";
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
  return (
    !post.thumbnail_url &&
    !post.url &&
    !post.embed_title &&
    !post.embed_description &&
    !post.embed_video_url
  );
};

export const getPostUrl = (post: PostView): string => {
  return `${post.community.actor_id.replace(
    `/c/${post.community.name}`,
    "/post/"
  )}${post.post.id}`;
};
