import { Router } from "express";
import { comunidadeIndigenaRoutes } from "@/routes/dominios/comunidadesIndigenas.routes.js";
import { EscolaridadeRouter } from "@/routes/dominios/escolaridade.routes.js";
import { GeneroRouter } from "@/routes/dominios/genero.routes.js";
import { RacaCorRouter } from "@/routes/dominios/racaCor.routes.js";
import { SexoRouter } from "@/routes/dominios/sexo.routes.js";
import { NivelRouter } from "@/routes/dominios/nivel.routes.js";
import { EstadoCivilRouter } from "@/routes/dominios/estadoCivil.routes.js";
import { ZonaEnderecoRouter } from "@/routes/dominios/zonaEndereco.routes.js";
import { LocalizacaoDiferenciadaRouter } from "@/routes/dominios/localizacaoDiferenciada.routes.js";
import { CargoRouter } from "@/routes/dominios/cargo.routes.js";
import { FuncaoRouter } from "@/routes/dominios/funcao.routes.js";
import { DepartamentoRouter } from "@/routes/dominios/departamento.routes.js";
import { TipoVinculoRouter } from "@/routes/dominios/tipoVinculo.routes.js";
import { TipoEnsinoMedioCursadoRouter } from "@/routes/dominios/tipoEnsinoMedio.routes.js";
import { SituacaoRouter } from "@/routes/dominios/situacao.routes.js";

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