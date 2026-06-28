import { SERVICES } from "./config";
import { http } from "./http";
import { unique, uniqueEmail } from "./unique";

export type RegisteredUser = {
  authId: string;
  accountId: string;
  username: string;
  email: string;
  password: string;
  token: string;
};

export async function registerAndLogin(prefix: string): Promise<RegisteredUser> {
  const username = unique(prefix);
  const email = uniqueEmail(prefix);
  const password = "Senha@123";

  const reg = await http.post<{ authId: string; accountId: string }>(
    `${SERVICES.auth}/register`,
    { username, name: `${prefix} E2E`, email, password, bornAt: "1998-01-15" },
  );

  if (!reg.ok) {
    throw new Error(`register failed (${reg.status}): ${JSON.stringify(reg.body)}`);
  }

  const { authId, accountId } = reg.body;

  const login = await http.post<{ token: string }>(
    `${SERVICES.auth}/login`,
    { email, password },
  );

  if (!login.ok) {
    throw new Error(`login failed (${login.status}): ${JSON.stringify(login.body)}`);
  }

  return { authId, accountId, username, email, password, token: login.body.token };
}
