import type { Request, Response } from "express";
import { testimonialService, type ITestimonialService } from "../services/testimonial.service.js";

class TestimonialController {
  constructor(private readonly testimonialService: ITestimonialService) {}

  // GET /testimonials — public list of user testimonials.
  async getAll(_: Request, res: Response) {
    const testimonials = await this.testimonialService.getAll();
    res.json(testimonials);
  }
}

export const testimonialController = new TestimonialController(testimonialService);
