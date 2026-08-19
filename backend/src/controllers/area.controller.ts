import type { Request, Response } from "express";
import { areaService, type IAreaService } from "../services/area.service.js";

class AreaController {
  constructor(private readonly areaService: IAreaService) {}

  // GET /areas — public list of dish origin areas.
  async getAll(_: Request, res: Response) {
    const areas = await this.areaService.getAll();
    res.json(areas);
  }
}

export const areaController = new AreaController(areaService);
