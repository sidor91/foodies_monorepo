import css from "./Testimonials.module.css";

const Testimonials = ({ testimonials, activeIndex, onIndexChange, isLoading }) => {
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
            onClick={() => onIndexChange(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
