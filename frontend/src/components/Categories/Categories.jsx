import css from "./Categories.module.css";
import CategoryCard from "../CategoryCard/CategoryCard.jsx";

const getAssetName = (name) => {
  const aliases = { Dessert: "Desserts" };
  return aliases[name] || name;
};

const Categories = ({
  categories,
  isLoading,
  error,
  onCategorySelect,
  isAllExpanded = false,
  onShowAllCategories,
}) => {
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

  const visibleCategories = isAllExpanded ? categories : categories.slice(0, 11);

  const categoryCards = visibleCategories.map((category) => {
    const assetName = getAssetName(category.name);

    return (
      <article className={css.card} key={category.id}>
        <CategoryCard
          name={category.name}
          image={`/categories/${assetName}.webp`}
          onSelect={() => onCategorySelect?.(category)}
        />
      </article>
    );
  });

  const allCategoriesCard = (
    <article className={`${css.card} ${css.card_all}`} key="all-categories">
      <button className={css.cardAllButton} type="button" onClick={() => onShowAllCategories?.()}>
        <span className={css.cardAllText}>All categories</span>
      </button>
    </article>
  );

  const cards = isAllExpanded ? categoryCards : [...categoryCards, allCategoriesCard];
  const rows = Array.from({ length: Math.ceil(cards.length / 3) }, (_, rowIndex) =>
    cards.slice(rowIndex * 3, rowIndex * 3 + 3),
  ).filter((row) => row.length > 0);

  return (
    <section className={css.categories} aria-labelledby="categories-title">
      <div className={css.heading}>
        <h2 id="categories-title" className="section__title">
          Categories
        </h2>
        <p>
          Discover a limitless world of culinary possibilities and enjoy exquisite recipes that
          combine taste, style and the warm atmosphere of the kitchen.
        </p>
      </div>
      <div className={`${css.grid} ${!isAllExpanded ? css.grid_collapsed : ""}`}>
        {rows.map((row, rowIndex) => (
          <div
            className={`${css.row} ${css[`row${(rowIndex % 4) + 1}`]}`}
            key={`row-${rowIndex + 1}`}
          >
            {row}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
