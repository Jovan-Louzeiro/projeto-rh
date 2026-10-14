import { FormularioDinamicoContainer } from "../components/formularios/FormularioDinamicoContainer";
import { adicionarRegistro } from "../services/crus.service";

export function CadastroPais() {
  async function cadastrarPais(
    dados: Record<string, unknown>
  ) {
    try {
      await adicionarRegistro("pais", dados);
      alert("País cadastrado com sucesso!");
    } catch (erro) {
      alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar o país."
      );
    }
  }

  return (
    <main>
      <h1>Cadastrar país</h1>

      <FormularioDinamicoContainer
        dominio="pais"
        operacao="adicionar"
        onSubmit={cadastrarPais}
      />
    </main>
  );
}
