import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import type { Servidor } from "./types";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Serviços
import {
  adaptarServidor,
  detalharServidor,
  type DetalhesServidor,
  type Servidor as ServidorApi,
} from "./services/servidores";
import { carregarDadosGeograficos, type DadosGeograficos } from "./services/localizacao";
import { carregarOpcoesServidor, type OpcoesServidorCompletas } from "./services/opcoesServidor";
import { isAuthenticated } from "./services/api";

// Páginas
import Dashboard from "./pages/Dashboard";
import Servidores from "./pages/Servidores";

import NovoServidor from "./pages/NovoServidor";
import PerfilServidor from "./pages/PerfilServidor";

import Ferias from "./pages/Ferias";
import NovaFerias from "./pages/NovaFerias";

import Licencas from "./pages/Licencas";
import NovaLicenca from "./pages/NovaLicenca";

import Contratos from "./pages/Contratos";
import NovoContrato from "./pages/NovoContrato";


import Quinquenios from "./pages/Quinquenios";
import NovoQuinquenio from "./pages/NovoQuinquenio";

import Solicitacoes from "./pages/Solicitacoes";
import NovaSolicitacao from "./pages/NovaSolicitacao";

import Documentos from "./pages/Documentos";
import NovoDocumento from "./pages/NovoDocumento";

import Relatorios from "./pages/Relatorios";
import ConfigurarRelatorio from "./pages/ConfigurarRelatorio";

import Configuracoes from "./pages/Configuracoes";
import Cadastros from "./pages/Cadastros";

import Requerimentos from "./pages/Requerimentos";
import NovoRequerimento from "./pages/NovoRequerimento";
import DetalheRequerimento from "./pages/DetalheRequerimento";

import Login from "./pages/Login";
import { CadastroPais } from "./pages/teste";

export default function App() {
  const [logged, setLogged] = useState(isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => setLogged(true)}
              logged={logged}
            />
          }
        />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<Protected logged={logged} />}>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<DashboardRoute />}
          />

          <Route
            path="/teste"
            element={<CadastroPais />}
          />

          {/* Servidores */}
          <Route
            path="/servidores"
            element={<ServidoresRoute />}
          />

          <Route
            path="/servidores/novo"
            element={<NovoServidorRoute />}
          />

          <Route
            path="/servidores/:id"
            element={<PerfilRoute />}
          />

          {/* Férias */}
          <Route
            path="/ferias"
            element={<FeriasRoute />}
          />

          <Route
            path="/ferias/novo"
            element={<NovaFeriasRoute />}
          />

          {/* Licenças */}
          <Route
            path="/licencas"
            element={<LicencasRoute />}
          />

          <Route
            path="/licencas/novo"
            element={<NovaLicencaRoute />}
          />

          {/* Contratos */}
          <Route
            path="/contratos"
            element={<ContratosRoute />}
          />

          <Route
            path="/contratos/novo"
            element={<NovoContratoRoute />}
          />

          {/* Quinquênios */}
          <Route
            path="/quinquenios"
            element={<QuinqueniosRoute />}
          />

          <Route
            path="/quinquenios/novo"
            element={<NovoQuinquenioRoute />}
          />

          {/* Solicitações */}
          <Route
            path="/solicitacoes"
            element={<SolicitacoesRoute />}
          />

          <Route
            path="/solicitacoes/nova"
            element={<NovaSolicitacaoRoute />}
          />

          {/* Documentos */}
          <Route
            path="/documentos"
            element={<DocumentosRoute />}
          />

          <Route
            path="/documentos/novo"
            element={<NovoDocumentoRoute />}
          />

          {/* Requerimentos */}
          <Route
            path="/requerimentos"
            element={<RequerimentosRoute />}
          />

          <Route
            path="/requerimentos/novo"
            element={<NovoRequerimentoRoute />}
          />

          <Route
            path="/requerimentos/:id/editar"
            element={<EditarRequerimentoRoute />}
          />

          <Route
            path="/requerimentos/:id"
            element={<DetalheRequerimentoRoute />}
          />

          {/* Relatórios */}
          <Route
            path="/relatorios"
            element={<RelatoriosRoute />}
          />

          {(
            [
              "servidores",
              "ferias",
              "licencas",
              "quinquenios",
              "contratos",
              "admissoes",
              "desligamentos",
            ] as const
          ).map((tipo) => (
            <Route
              key={tipo}
              path={`/relatorios/${tipo}`}
              element={<RelatorioRoute tipo={tipo} />}
            />
          ))}

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={<Configuracoes />}
          />

          <Route
            path="/configuracoes/prefeitura"
            element={
              <Configuracoes initialTab="prefeitura" />
            }
          />

          <Route
            path="/configuracoes/regras"
            element={
              <Configuracoes initialTab="regras" />
            }
          />

          <Route
            path="/configuracoes/usuarios"
            element={
              <Configuracoes initialTab="usuarios" />
            }
          />

          <Route
            path="/configuracoes/seguranca"
            element={
              <Configuracoes initialTab="seguranca" />
            }
          />

          <Route
            path="/configuracoes/auditoria"
            element={
              <Configuracoes initialTab="auditoria" />
            }
          />

          <Route
            path="/configuracoes/backup"
            element={
              <Configuracoes initialTab="dados" />
            }
          />

          <Route
            path="/configuracoes/aparencia"
            element={
              <Configuracoes initialTab="aparencia" />
            }
          />

          <Route path="/cadastros" element={<Cadastros />} />
        </Route>

        {/* REDIRECIONAMENTOS */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================================================
   PROTEÇÃO DAS ROTAS
========================================================= */

function Protected({
  logged,
}: {
  logged: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem("rh_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("rh_sidebar_collapsed", String(sidebarCollapsed));
    } catch {
      // A indisponibilidade do armazenamento não deve impedir a navegação.
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (!logged) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className={`app ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed(value => !value)} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main">
        <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(open => !open)} />

        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardRoute() {
  const navigate = useNavigate();

  return (
    <Dashboard
      navigate={(screen) =>
        navigate(`/${screen}`)
      }
    />
  );
}

/* =========================================================
   SERVIDORES
========================================================= */

function ServidoresRoute() {
  const navigate = useNavigate();

  return (
    <Servidores
      onProfile={(servidor) =>
        navigate(`/servidores/${servidor.id}`)
      }
      onEdit={(servidor) =>
        navigate(`/servidores/${servidor.id}`, { state: { editar: true } })
      }
      onNew={() =>
        navigate("/servidores/novo")
      }
    />
  );
}

function NovoServidorRoute() {
  const navigate = useNavigate();

  return (
    <NovoServidor
      onBack={() =>
        navigate("/servidores")
      }
    />
  );
}

/* =========================================================
   FÉRIAS
========================================================= */

function FeriasRoute() {
  const navigate = useNavigate();

  return (
    <Ferias
      onNew={() =>
        navigate("/ferias/novo")
      }
    />
  );
}

function NovaFeriasRoute() {
  const navigate = useNavigate();

  return (
    <NovaFerias
      onBack={() =>
        navigate("/ferias")
      }
    />
  );
}

/* =========================================================
   LICENÇAS
========================================================= */

function LicencasRoute() {
  const navigate = useNavigate();

  return (
    <Licencas
      onNew={() =>
        navigate("/licencas/novo")
      }
    />
  );
}

function NovaLicencaRoute() {
  const navigate = useNavigate();

  return (
    <NovaLicenca
      onBack={() =>
        navigate("/licencas")
      }
    />
  );
}

/* =========================================================
   CONTRATOS
========================================================= */

function ContratosRoute() {
  const navigate = useNavigate();

  return (
    <Contratos
      onNew={() =>
        navigate("/contratos/novo")
      }
    />
  );
}

function NovoContratoRoute() {
  const navigate = useNavigate();

  return (
    <NovoContrato
      onBack={() =>
        navigate("/contratos")
      }
    />
  );
}

/* =========================================================
   QUINQUÊNIOS
========================================================= */

function QuinqueniosRoute() {
  const navigate = useNavigate();

  return (
    <Quinquenios
      onNew={() =>
        navigate("/quinquenios/novo")
      }
    />
  );
}

function NovoQuinquenioRoute() {
  const navigate = useNavigate();

  return (
    <NovoQuinquenio
      onBack={() =>
        navigate("/quinquenios")
      }
    />
  );
}

/* =========================================================
   SOLICITAÇÕES
========================================================= */

function SolicitacoesRoute() {
  const navigate = useNavigate();

  return (
    <Solicitacoes
      onNew={() =>
        navigate("/solicitacoes/nova")
      }
    />
  );
}

function NovaSolicitacaoRoute() {
  const navigate = useNavigate();

  return (
    <NovaSolicitacao
      onBack={() =>
        navigate("/solicitacoes")
      }
    />
  );
}

/* =========================================================
   DOCUMENTOS
========================================================= */

function DocumentosRoute() {
  const navigate = useNavigate();

  return (
    <Documentos
      onNew={() =>
        navigate("/documentos/novo")
      }
    />
  );
}

function NovoDocumentoRoute() {
  const navigate = useNavigate();

  return (
    <NovoDocumento
      onBack={() =>
        navigate("/documentos")
      }
    />
  );
}

/* =========================================================
   RELATÓRIOS
========================================================= */

function RelatoriosRoute() {
  const navigate = useNavigate();

  return (
    <Relatorios
      onConfigurar={(tipo) =>
        navigate(`/relatorios/${tipo}`)
      }
    />
  );
}

function RelatorioRoute({
  tipo,
}: {
  tipo: Parameters<
    typeof ConfigurarRelatorio
  >[0]["tipo"];
}) {
  const navigate = useNavigate();

  return (
    <ConfigurarRelatorio
      tipo={tipo}
      onBack={() =>
        navigate("/relatorios")
      }
    />
  );
}

/* =========================================================
   REQUERIMENTOS
========================================================= */

function RequerimentosRoute() {
  const navigate = useNavigate();

  return (
    <Requerimentos
      onNew={() =>
        navigate("/requerimentos/novo")
      }
      onView={(id) =>
        navigate(`/requerimentos/${id}`)
      }
      onEdit={(id) =>
        navigate(`/requerimentos/${id}/editar`)
      }
    />
  );
}

function NovoRequerimentoRoute() {
  const navigate = useNavigate();

  return (
    <NovoRequerimento
      onBack={() =>
        navigate("/requerimentos")
      }
      onSaved={(id) =>
        navigate(`/requerimentos/${id}`)
      }
    />
  );
}

function EditarRequerimentoRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    return (
      <Navigate
        to="/requerimentos"
        replace
      />
    );
  }

  return (
    <NovoRequerimento
      id={id}
      onBack={() =>
        navigate(`/requerimentos/${id}`)
      }
      onSaved={(salvo) =>
        navigate(`/requerimentos/${salvo}`)
      }
    />
  );
}

function DetalheRequerimentoRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    return (
      <Navigate
        to="/requerimentos"
        replace
      />
    );
  }

  return (
    <DetalheRequerimento
      id={id}
      onBack={() =>
        navigate("/requerimentos")
      }
      onEdit={() =>
        navigate(`/requerimentos/${id}/editar`)
      }
    />
  );
}

/* =========================================================
   PERFIL DO SERVIDOR
========================================================= */

function PerfilRoute() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const iniciarEdicao = typeof location.state === "object"
    && location.state !== null
    && "editar" in location.state
    && location.state.editar === true;

  const [perfil, setPerfil] = useState<{
    servidor: Servidor;
    detalhes: DetalhesServidor;
    geografia: DadosGeograficos;
    opcoes: OpcoesServidorCompletas;
  } | null>(null);
  const [versaoPerfil, setVersaoPerfil] = useState(0);

  const [erro, setErro] =
    useState("");

  useEffect(() => {
    const controller =
      new AbortController();

    if (!id) return () => controller.abort();

    Promise.all([
      detalharServidor(id, controller.signal),
      carregarDadosGeograficos(controller.signal),
      carregarOpcoesServidor(controller.signal),
    ])
      .then(([detalhes, geografia, opcoes]) => {
        setPerfil({
          servidor: adaptarServidor(detalhes as ServidorApi),
          detalhes,
          geografia,
          opcoes,
        });
      })
      .catch((error) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setErro(
          "Não foi possível carregar o perfil do servidor."
        );
      });

    return () =>
      controller.abort();
  }, [id, versaoPerfil]);

  if (erro) {
    return (
      <p className="form-error">
        {erro}
      </p>
    );
  }

  if (!perfil) {
    return (
      <p className="table-message">
        Carregando perfil do servidor...
      </p>
    );
  }

  return (
    <PerfilServidor
      servidor={perfil.servidor}
      detalhes={perfil.detalhes}
      geografia={perfil.geografia}
      opcoes={perfil.opcoes}
      iniciarEdicao={iniciarEdicao}
      onUpdated={() => setVersaoPerfil(versao => versao + 1)}
      onQuinquenios={() =>
        navigate("/quinquenios")
      }
    />
  );
}
