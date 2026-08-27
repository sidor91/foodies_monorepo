import css from "./CategoryCard.module.css";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback.jsx";

const CategoryCard = ({ name, image, onSelect }) => {
  return (
    <>
      <ImageWithFallback className={css.image} src={image} alt="" />
      <div className={css.overlay}>
        <button className={css.overlayLabelBtn} type="button" onClick={onSelect}>
          {name}
        </button>
        <button
          className={css.overlayIconBtn}
          type="button"
          onClick={onSelect}
          aria-label={`Open ${name} category`}
        >
          <svg>
            <use href="/icons.svg#icon-arrow-up-right" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default CategoryCard;
