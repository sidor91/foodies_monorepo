import type { Request, Response } from "express";
import { areaRepository } from "../repositories/area.repository.js";

class AreaController {
    // GET /areas — public list of dish origin areas.
    getAll = async (req: Request, res: Response) => {
        const areas = await areaRepository.findAllSorted();
        res.json(areas);
    };
}

export const areaController = new AreaController();
