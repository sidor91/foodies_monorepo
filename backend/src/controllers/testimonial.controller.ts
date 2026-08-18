import type { Request, Response } from "express";
import { testimonialService } from "../services/testimonial.service.js";

class TestimonialController {
    // GET /testimonials — public list of user testimonials.
    getAll = async (req: Request, res: Response) => {
        const testimonials = await testimonialService.getAll();
        res.json(testimonials);
    };
}

export const testimonialController = new TestimonialController();
