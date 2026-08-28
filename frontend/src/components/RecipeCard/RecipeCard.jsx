import css from "./RecipeCard.module.css";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback.jsx";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe, isFavorite = false, onFavoriteToggle }) => {
  const ownerName = recipe.owner?.name || "Foodies";
  const navigate = useNavigate();

  return (
    <article className={css.card}>
      <ImageWithFallback className={css.image} src={recipe.image} alt={recipe.title} />

      <h3 className={css.title}>{recipe.title}</h3>
      <p className={css.text}>{recipe.description || "No description yet."}</p>

      <div className={css.meta}>
        <div className={css.owner}>
          <ImageWithFallback
            className={css.ownerAvatar}
            src={recipe.owner?.avatarUrl}
            alt={ownerName}
            placeholder="avatar"
          />
          <span>{ownerName}</span>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={isFavorite ? css.favoriteActive : ""}
            onClick={() => onFavoriteToggle?.(recipe.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 21s-7-4.7-9.2-8.2C1.4 10.5 2 7.2 4.7 5.6A5.2 5.2 0 0 1 12 8a5.2 5.2 0 0 1 7.3-2.4c2.7 1.6 3.3 4.9 1.9 7.2C19 16.3 12 21 12 21Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            aria-label="Open recipe"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
