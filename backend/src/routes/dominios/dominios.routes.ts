import { Router } from "express";
import { comunidadeIndigenaRoutes } from "./comunidadesIndigenas.routes.js";
import { EscolaridadeRouter } from "./escolaridade.routes.js";
import { domainToUnicode } from "node:url";
import { GeneroRouter } from "./genero.routes.js";
import { RacaCorRouter } from "./racaCor.routes.js";
import { SexoRouter } from "./sexo.routes.js";
import { NivelRouter } from "./nivel.routes.js";
import { EstadoCivilRouter } from "./estadoCivil.routes.js";
import { ZonaEnderecoRouter } from "./zonaEndereco.routes.js";
import { LocalizacaoDiferenciadaRouter } from "./localizacaoDiferenciada.routes.js";
import { CargoRouter } from "./cargo.routes.js";
import { FuncaoRouter } from "./funcao.routes.js";
import { DepartamentoRouter } from "./departamento.routes.js";
import { TipoVinculoRouter } from "./tipoVinculo.routes.js";
import { TipoEnsinoMedioCursadoRouter } from "./tipoEnsinoMedio.routes.js";
import { SituacaoRouter } from "./situacao.routes.js";

const dominiosRoutes = Router()

dominiosRoutes.use("/comunidadesIndigenas", new comunidadeIndigenaRoutes().router)

dominiosRoutes.use("/escolaridade", new EscolaridadeRouter().router)

dominiosRoutes.use("/generos", new GeneroRouter().router)

dominiosRoutes.use("/racacor", new RacaCorRouter().router)

dominiosRoutes.use("/sexos", new SexoRouter().router)

dominiosRoutes.use("/nivel", new NivelRouter().router)

dominiosRoutes.use("/estadoCivil", new EstadoCivilRouter().router)

dominiosRoutes.use("/zonaEndereco", new ZonaEnderecoRouter().router)

dominiosRoutes.use("/localizacaoDiferenciada", new LocalizacaoDiferenciadaRouter().router)

dominiosRoutes.use("/cargo", new CargoRouter().router)

dominiosRoutes.use("/funcao", new FuncaoRouter().router)

dominiosRoutes.use("/departamento", new DepartamentoRouter().router)

dominiosRoutes.use("/tipoVinculo", new TipoVinculoRouter().router)

dominiosRoutes.use("/tipoEnsinoMedioCursado", new TipoEnsinoMedioCursadoRouter().router)

dominiosRoutes.use("/situacao", new SituacaoRouter().router)

export default dominiosRoutes