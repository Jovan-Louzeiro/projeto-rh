import { Request, Response } from "express";
import { PaisService } from "../services/pais.service.js";
import { CrudController } from "./crud.controller.js";

export class PaisController extends CrudController{

    private paisService: PaisService<any, any>

    constructor(){
        const service = new PaisService()

        super(service)

        this.paisService = service
    }
}