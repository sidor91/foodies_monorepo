import Button from "../Button/Button.jsx";

import css from "./Hero.module.css";

const heroImages = [
  {
    src: "/hero/heroPreviewSmall.webp",
    srcSet: "/hero/heroPreviewSmall.webp 1x, /hero/heroPreviewSmall@2x.webp 2x",
    alt: "Foodies dessert preview",
    className: css.hero__image_secondary,
  },
  {
    src: "/hero/heroPreviewBig.webp",
    srcSet: "/hero/heroPreviewBig.webp 1x, /hero/heroPreviewBig@2x.webp 2x",
    alt: "Featured Foodies dish",
    className: css.hero__image_main,
  },
];

const Hero = ({ isLoading }) => {
  return (
    <section className={css.hero}>
      <div className={css.hero__content}>
        <h1>Improve your culinary talents</h1>
        <p className={css.hero__description}>
          Amazing recipes for beginners in the world of cooking, enveloping you in the aromas and
          tastes of various cuisines.
        </p>
        <Button className={css.hero__button} variant="secondary" to="/add-recipe">
          Add recipe
        </Button>
      </div>

      <div className={`${css.hero__images} ${isLoading ? css.hero__images_loading : ""}`}>
        {heroImages.map((image) => (
          <img
            key={image.src}
            className={image.className}
            src={image.src}
            srcSet={image.srcSet}
            alt={image.alt}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
