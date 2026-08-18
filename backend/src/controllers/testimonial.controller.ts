import type { Request, Response } from "express";
import { testimonialRepository } from "../repositories/testimonial.repository.js";

class TestimonialController {
    // GET /testimonials — public list of user testimonials.
    getAll = async (req: Request, res: Response) => {
        const testimonials = await testimonialRepository.findAllWithOwner();
        res.json(testimonials);
    };
}

export const testimonialController = new TestimonialController();
