import { LemmyHttp, Login } from "lemmy-js-client";

export const useLogin = async (instanceHost: string, loginForm: Login) => {
  let client: LemmyHttp = new LemmyHttp(instanceHost);
  let loginResult = await client.login(loginForm);

  return loginResult.jwt;
};
