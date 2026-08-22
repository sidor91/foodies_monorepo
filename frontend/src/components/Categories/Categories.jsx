import css from "./Categories.module.css";

const getAssetName = (name) => {
  const aliases = { Dessert: "Desserts" };
  return aliases[name] || name;
};

const Categories = ({ categories, isLoading, error, onCategorySelect }) => {
  if (isLoading && categories.length === 0) {
    return (
      <section aria-label="Categories" className={css.state}>
        Loading categories...
      </section>
    );
  }

  if (error && categories.length === 0) {
    return (
      <section aria-label="Categories" className={css.state}>
        Categories are unavailable right now.
      </section>
    );
  }

  const categoryCards = categories.slice(0, 11).map((category) => {
    const assetName = getAssetName(category.name);

    return (
      <article className={css.card} key={category.id}>
        <img
          src={`/categories/${assetName}.webp`}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <div className={css.overlay}>
          <button
            className={css.overlayLabelBtn}
            type="button"
            onClick={() => onCategorySelect?.(category)}
          >
            {category.name}
          </button>
          <button
            className={css.overlayIconBtn}
            type="button"
            onClick={() => onCategorySelect?.(category)}
            aria-label={`Open ${category.name} category`}
          >
            <svg>
              <use href="/icons.svg#icon-arrow-up-right" />
            </svg>
          </button>
        </div>
      </article>
    );
  });

  const allCategoriesCard = (
    <article className={`${css.card} ${css.card_all}`} key="all-categories">
      <button className={css.cardAllButton} type="button" onClick={() => onCategorySelect?.(null)}>
        <span className={css.cardAllText}>All categories</span>
      </button>
    </article>
  );

  const cards = [...categoryCards, allCategoriesCard].slice(0, 12);
  const rows = Array.from({ length: 4 }, (_, rowIndex) =>
    cards.slice(rowIndex * 3, rowIndex * 3 + 3),
  ).filter((row) => row.length > 0);

  return (
    <section className={css.categories} aria-labelledby="categories-title">
      <div className={css.heading}>
        <h2 id="categories-title">Categories</h2>
        <p>
          Discover a limitless world of culinary possibilities and enjoy exquisite recipes that
          combine taste, style and the warm atmosphere of the kitchen.
        </p>
      </div>
      <div className={css.grid}>
        {rows.map((row, rowIndex) => (
          <div className={`${css.row} ${css[`row${rowIndex + 1}`]}`} key={`row-${rowIndex + 1}`}>
            {row}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
