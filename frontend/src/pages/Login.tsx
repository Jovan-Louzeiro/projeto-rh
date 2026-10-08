import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Icon from "../components/Icon";
import PrefeituraLogo from "../components/PrefeituraLogo";
import { realizarLogin } from "../services/login";

type Props = {
  onLogin: () => void;
  logged: boolean;
};

export default function Login({
  onLogin,
  logged,
}: Props) {
  const navigate = useNavigate();

  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  /*
   * Se o usuário já estiver logado,
   * não precisa permanecer na tela de login.
   */
  if (logged) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setLoading(true);

    try {
      const resultado = await realizarLogin(
        email.trim(),
        senha
      );

      console.log(
        "Resultado do login:",
        resultado
      );

      /*
       * O serviço realizarLogin já deve lançar
       * um erro caso a API retorne falha.
       */
      onLogin();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error
      );

      setErro(
        error instanceof Error &&
          error.message
          ? error.message
          : "E-mail ou senha inválidos."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRecuperarSenha(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    console.log(
      "Solicitação de recuperação para:",
      email
    );

    /*
     * Aqui você poderá integrar futuramente
     * o endpoint de recuperação de senha.
     */
    setForgot(false);
  }

  function abrirRecuperacao() {
    setErro("");
    setForgot(true);
  }

  function voltarLogin() {
    setErro("");
    setForgot(false);
  }

  return (
    <div className="login-screen">
      <div className="login-card">

        {/* ==================================================
            IDENTIDADE VISUAL
        ================================================== */}

        <div className="brand-center">
          <div className="brand-logo">
            <PrefeituraLogo />
          </div>

          <h1>RH DIGITAL</h1>

          <p>
            Prefeitura de Carutapera - MA
          </p>
        </div>

        {!forgot ? (
          <>
            {/* ==================================================
                LOGIN
            ================================================== */}

            <h2>Acesse sua conta</h2>

            <p className="muted">
              Entre com seus dados para continuar.
            </p>

            <form onSubmit={handleLogin}>

              <label>
                E-mail

                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </label>

              <label>
                Senha

                <input
                  type="password"
                  name="senha"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </label>

              {erro && (
                <p
                  className="login-error"
                  role="alert"
                >
                  {erro}
                </p>
              )}

              <button
                type="button"
                className="forgot"
                onClick={abrirRecuperacao}
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>

              <button
                type="submit"
                className="btn primary full login-btn"
                disabled={loading}
              >
                {loading
                  ? "Entrando..."
                  : "Entrar"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* ==================================================
                RECUPERAÇÃO DE SENHA
            ================================================== */}

            <h2>Recuperar senha</h2>

            <p className="muted">
              Informe seu e-mail para receber
              as instruções.
            </p>

            <form
              onSubmit={
                handleRecuperarSenha
              }
            >
              <label>
                E-mail

                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  required
                />
              </label>

              <button
                type="submit"
                className="btn primary full login-btn"
              >
                Enviar instruções
              </button>
            </form>

            <button
              type="button"
              className="back-login"
              onClick={voltarLogin}
            >
              <Icon name="arrow-left" />

              Voltar para o login
            </button>
          </>
        )}

        {/* ==================================================
            RODAPÉ
        ================================================== */}

        <small>
          © 2026 Prefeitura de Carutapera - MA
        </small>
      </div>
    </div>
  );
}