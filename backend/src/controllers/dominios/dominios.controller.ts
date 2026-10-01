import type { Request, Response } from "express";
import { DominioServices } from "../../services/dominios/dominios.service.js";
import { CrudController } from "../crud.controller.js";

export class DominioController extends CrudController {

    constructor(DominioServices: DominioServices<any, any>){
        super(
            DominioServices
        )
    }
}