import {
    testimonialRepository,
    TTestimonialRepository,
} from "../repositories/testimonial.repository.js";

export interface ITestimonialService {
    getAll: TTestimonialRepository["findAllWithOwner"];
}

class TestimonialService implements ITestimonialService {
    constructor(private readonly testimonialRepository: TTestimonialRepository) {}

    getAll() {
        return this.testimonialRepository.findAllWithOwner();
    }
}

export const testimonialService: ITestimonialService = new TestimonialService(
    testimonialRepository,
);
