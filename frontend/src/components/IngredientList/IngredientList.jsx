import Icon from "../Icon/Icon";

const IngredientList = ({ ingredients, onRemove }) => {
  return (
    <ul className="flex mb-[6.4rem] tablet:mb-[8rem] gap-[1.6rem] flex-wrap">
      {ingredients.map((ing, index) => (
        <li key={index} className="flex gap-[1rem] items-center ">
          <div
            className="w-[7.5rem] h-[7.5rem] tablet:w-[9rem] tablet:h-[9rem] rounded-[1.5rem] border  border-(--grey) 
          overflow-hidden flex items-center justify-center"
          >
            {ing.img && (
              <img src={ing.img} alt={ing.name} className="w-full h-full object-contain" />
            )}
          </div>

          <div className="flex items-center w-[7.5rem] h-[7.5rem] tablet:w-[9rem] tablet:h-[9rem] relative">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-0 top-0"
            >
              <Icon name="close" size={16} className="stroke-(--black)" />
            </button>
            <div className="flex flex-col">
              <span className="text-[1.4rem] tablet:text-[1.6rem] font-[500] text-(--black) leading-[143%] tablet:leading-[143%]">
                {ing.name}
              </span>
              <span className="text-[1.4rem] tablet:text-[1.4rem] font-[500] text-(--grey) leading-[143%] tablet:leading-[143%]">
                {ing.quantity}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default IngredientList;
