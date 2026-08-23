import css from "./CategoryCard.module.css";

const CategoryCard = ({ name, image, onSelect }) => {
  return (
    <>
      <img
        className={css.image}
        src={image}
        alt=""
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
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
