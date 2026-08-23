import css from "./IngredientList.module.css";

const IngredientList = ({ ingredients, onRemove }) => {
  return (
    <div className={css.cardsList}>
      {ingredients.map((ing, index) => (
        <div key={index} className={css.ingredientCard}>
          {ing.img && <img src={ing.img} alt={ing.name} className={css.cardImg} />}

          <div className={css.cardInfo}>
            <span className={css.cardName}>{ing.name}</span>
            <span className={css.cardQuantity}>{ing.quantity}</span>
          </div>

          <button type="button" onClick={() => onRemove(index)} className={css.removeCardBtn}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
export default IngredientList;
