import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useLemmyHttp } from "../host/useLemmyHttp";
import { storage } from "@rn-app/utils/storage";
import { KEYS } from "@rn-app/utils/constants";

export interface User {
  id: number;
  username: string;
  jwt: string;
  instance: string;
  actorId: string;
}

const getProfileForCurrentUser = async () => {
  const user = await getCurrentUserSession();
  return getProfileForUser({ userId: user.id });
};

const getProfileForUser = async ({ userId }: { userId: number }) => {
  const client = useLemmyHttp();
  const user = await getCurrentUserSession();

  return await client.getPersonDetails({
    auth: user?.jwt,
    person_id: userId,
    saved_only: false,
    limit: 40,
    page: 1,
  });
};

const getCurrentUserSession = async (): Promise<User> => {
  const auth_tokens = JSON.parse(
    storage.getString(KEYS.STORAGE.AUTH.LEMMY_USERS) || "{}"
  );
  const actorId = storage.getString(KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION);
  return !!actorId && auth_tokens[actorId];
};

export const getCurrentUserSessionToken = async (): Promise<string> => {
  return (await getCurrentUserSession())?.jwt;
};

const getUsers = async (): Promise<Map<string, User>> => {
  return JSON.parse(storage.getString(KEYS.STORAGE.AUTH.LEMMY_USERS) || "{}");
};

export const authQueries = createQueryKeys("auth", {
  currentUserSession: () => ({
    queryKey: [{ userId: "currentUser", entity: "session" }],
    queryFn: () => getCurrentUserSession(),
  }),
  userProfile: (userId?: number) => ({
    queryKey: [{ userId: userId ?? -1, entity: "profile" }],
    queryFn: () =>
      userId ? getProfileForUser({ userId }) : getProfileForCurrentUser(),
  }),

  users: () => ({
    queryKey: [{ entity: "users" }],
    queryFn: () => getUsers(),
  }),
});
