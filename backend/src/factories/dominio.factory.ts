import { DominioConfig } from "../types/dominio.types.js";
import { DominiosRoutes } from "../routes/dominios.routes.js";
import { DominioSchemas } from "../schemas/dominosSchema.js"
import { DominioServices } from "../services/dominios.service.js";

export function criarDominio(
    dominioConfig: DominioConfig) {
    const schemaDominio = new DominioSchemas(
        dominioConfig.limiteDescricao
    );

    const serviceDominio = new DominioServices(
        dominioConfig.prismaModel,
        dominioConfig
    );

    return new DominiosRoutes(
        serviceDominio,
        schemaDominio,
        dominioConfig.nome,
        dominioConfig.autorizacoes
    );
}