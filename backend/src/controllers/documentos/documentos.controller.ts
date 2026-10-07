import { DocumentosServices } from "../../services/documentos/documentos.service.js";
import { CrudController } from "../crud.controller.js";

export class DocumentosController extends CrudController{
    
    constructor(DocumentoService: DocumentosServices<any, any>){
        super(
            DocumentoService
        )
    
    }

}