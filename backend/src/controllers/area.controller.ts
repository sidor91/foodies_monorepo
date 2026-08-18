import type { Request, Response } from "express";
import { areaService, type IAreaService } from "../services/area.service.js";

class AreaController {
    constructor(private readonly areaService: IAreaService) {
        this.getAll = this.getAll.bind(this);
    }

    // GET /areas — public list of dish origin areas.
    async getAll(req: Request, res: Response) {
        const areas = await this.areaService.getAll();
        res.json(areas);
    }
}

export const areaController = new AreaController(areaService);
