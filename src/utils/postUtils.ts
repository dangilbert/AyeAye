import { Post } from "lemmy-js-client";
import { isImage } from "./urlUtils";

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
    (!!post.url && isImage(post.url))
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

export const getShareContent = (post: Post): string => {
  const postType = getPostType(post);

  console.log(post);

  switch (postType) {
    case "Image":
      return post.url + (post.name ? "\n\n" + post.name : "");
    case "Video":
      return post.embed_video_url + (post.name ? "\n\n" + post.name : "");
    case "Link":
      return post.url + (post.name ? "\n\n" + post.name : "");
    case "SimpleLink":
      return post.url + (post.name ? "\n\n" + post.name : "");
    case "Text":
      return post.name + "\n\n" + post.ap_id;
    default:
      return "";
  }
};
