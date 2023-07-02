import { User, authQueries } from "@rn-app/pods/auth/queries";
import { KEYS } from "@rn-app/utils/constants";
import { storage } from "@rn-app/utils/storage";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = ({ enabled }: { enabled: boolean }) => {
  const { data } = useQuery({
    ...authQueries.currentUserSession(),
    enabled,
  });

  return data;
};

export const useUserSessions = () => {
  const { data } = useQuery({
    ...authQueries.users(),
  });

  return data;
};

export const saveAccount = (user: User) => {
  const users = JSON.parse(
    storage.getString(KEYS.STORAGE.AUTH.LEMMY_USERS) || "{}"
  );
  storage.set(
    KEYS.STORAGE.AUTH.LEMMY_USERS,
    JSON.stringify({
      ...users,
      [user.actorId]: user,
    })
  );
};

export const setActiveLemmySession = (actorId?: string) => {
  actorId
    ? storage.set(KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION, actorId)
    : storage.delete(KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION);
};

export const deleteAccount = (actorId: string) => {
  const users = JSON.parse(
    storage.getString(KEYS.STORAGE.AUTH.LEMMY_USERS) || "{}"
  );
  delete users[actorId];
  storage.set(KEYS.STORAGE.AUTH.LEMMY_USERS, JSON.stringify(users));

  if (actorId === storage.getString(KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION)) {
    storage.delete(KEYS.STORAGE.AUTH.LEMMY_ACTIVE_SESSION);
  }
};
