import type { Request, Response } from "express";
import { areaService } from "../services/area.service.js";

class AreaController {
    // GET /areas — public list of dish origin areas.
    getAll = async (req: Request, res: Response) => {
        const areas = await areaService.getAll();
        res.json(areas);
    };
}

export const areaController = new AreaController();
