
export async function realizarLogin(
  email: string,
  senha: string
) {
  const response = await fetch(
    "https://projeto-rh-sj48.onrender.com/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erro na requisição: ${response.status}`
    );
  }

  const data = await response.json();

  const token =
    data.token ?? data.accessToken ?? data.access_token ?? data.token_access;
  if (typeof token === "string" && token.length > 0) {
    localStorage.setItem("rh_access_token", token);
  }

  return data;
}
