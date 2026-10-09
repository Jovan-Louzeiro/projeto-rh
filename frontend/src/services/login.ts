import { apiPost, setToken } from "./api";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  token_access?: string;
  data?: LoginResponse;
};

export async function realizarLogin(email: string, senha: string) {
  const data = await apiPost<LoginResponse>("/api/login", { email, senha });
  const token = data.token ?? data.accessToken ?? data.access_token ?? data.token_access
    ?? data.data?.token ?? data.data?.accessToken ?? data.data?.access_token ?? data.data?.token_access;

  if (!token) throw new Error("A API não retornou um token de acesso.");
  setToken(token);
  return data;
}
