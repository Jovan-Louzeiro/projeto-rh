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
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    }
  );

  if (!response.ok) {
    let mensagem = `Erro na requisição: ${response.status}`;

    try {
      const erro = await response.json();

      mensagem =
        erro?.message ??
        erro?.mensagem ??
        erro?.erro ??
        mensagem;
    } catch {
      // A API não retornou JSON.
    }

    throw new Error(mensagem);
  }

  const data = await response.json();

  console.log("[LOGIN] Resposta da API:", data);

  const token =
    data?.token ??
    data?.accessToken ??
    data?.access_token ??
    data?.token_access ??
    data?.data?.token ??
    data?.data?.accessToken ??
    data?.data?.access_token ??
    data?.data?.token_access;

  if (typeof token === "string" && token.length > 0) {
    localStorage.setItem("rh_access_token", token);

    console.log("[LOGIN] Token salvo com sucesso.");
  } else {
    console.error(
      "[LOGIN] A API respondeu, mas nenhum token foi encontrado.",
      data
    );
  }

  return data;
}