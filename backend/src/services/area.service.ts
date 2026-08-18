import { areaRepository } from "../repositories/area.repository.js";

type AreaRepository = typeof areaRepository;

class AreaService {
    constructor(private readonly areaRepository: AreaRepository) {}

    getAll() {
        return this.areaRepository.findAllSorted();
    }
}

export const areaService = new AreaService(areaRepository);
