import { areaRepository, TAreaRepository } from "../repositories/area.repository.js";

export interface IAreaService {
  getAll: TAreaRepository["findAllSorted"];
}

class AreaService implements IAreaService {
  constructor(private readonly areaRepository: TAreaRepository) {}

  getAll() {
    return this.areaRepository.findAllSorted();
  }
}

export const areaService: IAreaService = new AreaService(areaRepository);
