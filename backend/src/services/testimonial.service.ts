import { testimonialRepository } from "../repositories/testimonial.repository.js";

type TestimonialRepository = typeof testimonialRepository;

export interface ITestimonialService {
    getAll: TestimonialRepository["findAllWithOwner"];
}

class TestimonialService implements ITestimonialService {
    constructor(private readonly testimonialRepository: TestimonialRepository) {}

    getAll() {
        return this.testimonialRepository.findAllWithOwner();
    }
}

export const testimonialService: ITestimonialService = new TestimonialService(
    testimonialRepository,
);
