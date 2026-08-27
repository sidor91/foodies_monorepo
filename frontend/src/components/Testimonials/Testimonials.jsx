import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTestimonials } from "../../../redux/references/referencesOps.js";
import {
  selectReferencesIsLoading,
  selectTestimonials,
} from "../../../redux/references/referencesSelectors.js";

import css from "./Testimonials.module.css";

const Testimonials = () => {
  const dispatch = useDispatch();
  const testimonials = useSelector(selectTestimonials);
  const isLoading = useSelector(selectReferencesIsLoading);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    setActiveIndex(0);
  }, [testimonials.length]);

  if (isLoading && testimonials.length === 0) {
    return <section className={css.state}>Loading testimonials...</section>;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[activeIndex];

  return (
    <section className={css.testimonials} aria-labelledby="testimonials-title">
      <p className={css.kicker}>What our customer say</p>
      <h2 id="testimonials-title">Testimonials</h2>
      <div className={css.quote} aria-live="polite">
        <span className={css.quote_mark} aria-hidden="true">
          &ldquo;
        </span>
        <blockquote>{testimonial.testimonial}</blockquote>
        <p className={css.author}>{testimonial.owner?.name || "Foodies customer"}</p>
      </div>
      <div className={css.controls} aria-label="Choose testimonial">
        {testimonials.map((item, index) => (
          <button
            key={item.id}
            className={index === activeIndex ? css.control_active : ""}
            type="button"
            aria-label={`Show testimonial ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
