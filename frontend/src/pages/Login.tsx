
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Icon from "../components/Icon";
import PrefeituraLogo from "../components/PrefeituraLogo";
import { realizarLogin } from "../services/login";

type Props = {
  onLogin: () => void;
  logged: boolean;
};

export default function Login({ onLogin, logged }: Props) {
  const nav = useNavigate();

  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (logged) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setLoading(true);

    try {
      const resultado = await realizarLogin(email, senha);

      console.log("Resultado do login:", resultado);

      // Se a API respondeu com sucesso
      onLogin();
      nav("/dashboard");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  function handleRecuperarSenha(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    console.log(
      "Solicitação de recuperação para:",
      email
    );

    setForgot(false);
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Identidade visual */}
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
            {/* Login */}
            <h2>Acesse sua conta</h2>

            <p className="muted">
              Entre com seus dados para continuar.
            </p>

            <form onSubmit={handleLogin}>
              <label>
                E-mail

                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                Senha

                <input
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) =>
                    setSenha(e.target.value)
                  }
                  required
                />
              </label>

              {erro && (
                <p className="login-error">
                  {erro}
                </p>
              )}

              <button
                type="button"
                className="forgot"
                onClick={() => {
                  setErro("");
                  setForgot(true);
                }}
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
            {/* Recuperação de senha */}
            <h2>Recuperar senha</h2>

            <p className="muted">
              Informe seu e-mail para receber as instruções.
            </p>

            <form
              onSubmit={handleRecuperarSenha}
            >
              <label>
                E-mail

                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
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
              onClick={() => {
                setErro("");
                setForgot(false);
              }}
            >
              <Icon name="arrow-left" />
              Voltar para o login
            </button>
          </>
        )}

        {/* Rodapé */}
        <small>
          © 2026 Prefeitura de Carutapera - MA
        </small>
      </div>
    </div>
  );
}
