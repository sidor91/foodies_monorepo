import { areaRepository } from "../repositories/area.repository.js";

type AreaRepository = typeof areaRepository;

export interface IAreaService {
    getAll: AreaRepository["findAllSorted"];
}

class AreaService implements IAreaService {
    constructor(private readonly areaRepository: AreaRepository) {}

    getAll() {
        return this.areaRepository.findAllSorted();
    }
}

export const areaService: IAreaService = new AreaService(areaRepository);
