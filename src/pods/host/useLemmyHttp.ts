import { useQueryClient } from "@tanstack/react-query";
import { LemmyHttp } from "lemmy-js-client";
import { storage } from "@rn-app/utils/storage";

export const useLemmyHttp = () => {
  let instance = storage.getString("lemmy_instance");
  if (!instance) {
    storage.set("lemmy_instance", "https://lemmy.ml");
    instance = storage.getString("lemmy_instance");
  }

  console.log("instance", instance);
  return new LemmyHttp(instance!!);
};

export const getCurrentAuthToken = () => {
  const auth_tokens = JSON.parse(storage.getString("lemmy_auth") || "{}");
  const instance = storage.getString("lemmy_instance");
  return !!instance ? auth_tokens[instance] : undefined;
};

export const setLemmyInstance = (instance: string, jwt: string) => {
  console.log("instance", instance);
  storage.set("lemmy_instance", instance);
  const auth_tokens = JSON.parse(storage.getString("lemmy_auth") || "{}");
  storage.set(
    "lemmy_auth",
    JSON.stringify({ ...auth_tokens, [instance]: jwt })
  );
  // Invalidate all the queries after login
  useQueryClient().invalidateQueries();
};
