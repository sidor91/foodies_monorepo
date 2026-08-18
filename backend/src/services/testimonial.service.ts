import { testimonialRepository } from "../repositories/testimonial.repository.js";

type TestimonialRepository = typeof testimonialRepository;

class TestimonialService {
    constructor(private readonly testimonialRepository: TestimonialRepository) {}

    getAll() {
        return this.testimonialRepository.findAllWithOwner();
    }
}

export const testimonialService = new TestimonialService(testimonialRepository);
