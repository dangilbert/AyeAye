import { LemmyHttp } from "lemmy-js-client";
import { storage } from "@rn-app/utils/storage";
import { KEYS } from "@rn-app/utils/constants";

const DEFAULT_INSTANCE = "https://lemmy.ml";

export const useLemmyHttp = () => {
  const activeSession = storage.getString(
    KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION
  );
  const sessions = JSON.parse(
    storage.getString(KEYS.STORAGE.AUTH.LEMMY_USERS) || "{}"
  );
  let instance = activeSession && sessions[activeSession]?.instance;

  return new LemmyHttp(instance ?? DEFAULT_INSTANCE);
};
