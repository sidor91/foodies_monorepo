import Icon from "../Icon/Icon";
import css from "./IngredientList.module.css";

const IngredientList = ({ ingredients, onRemove }) => {
  return (
    <div className="mb-[6.4rem] flex">
      {ingredients.map((ing, index) => (
        <div key={index} className="flex">
          <div className="w-[7.5rem] h-[7.5rem] rounded-[0.3rem">
            {ing.img && <img src={ing.img} alt={ing.name} className={css.cardImg} />}
          </div>

          <div>
            <button type="button" onClick={() => onRemove(index)} className={css.removeCardBtn}>
              <Icon name="close" size={16} className="stroke-(--black)" />
            </button>
            <div className="flex flex-col">
              <span className="text-[1.4rem] font-[700] text-(--black) leading-[143%]">
                {ing.name}
              </span>
              <span className="text-[1.4rem] font-[700] text-(--grey) leading-[143%]">
                {ing.quantity}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default IngredientList;
