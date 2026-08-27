import AddRecipeForm from "../../components/AddRecipeForm/AddRecipeForm";
import PathInfo from "../../components/PathInfo/PathInfo";
import MainTitle from "../../components/MainTitle/MainTitle";
import Subtitle from "../../components/Subtitle/Subtitle";
import { selectRecipesError } from "../../../redux/recipes/recipesSelectors.js";
import { useSelector } from "react-redux";
import NotFound from "../NotFound/NotFound.jsx";

const AddRecipe = () => {
  const error = useSelector(selectRecipesError);

  return (
    <div className="section">
      <div className="container">
        <div className="desktop:w-[128rem] desktop:ml-[7.8rem]">
          <PathInfo
            currentPage="Add Recipe"
            className="flex justify-start mb-[3.2rem] tablet:mb-[4rem] mt-[4.8rem]"
          />
          <MainTitle className="mb-[1.6rem] tablet:mb-[2rem]">Add Recipe</MainTitle>
          <Subtitle className="mb-[3.2rem]  tablet:mb-[4rem]" />
        </div>

        <div className="flex justify-center w-full">
          <AddRecipeForm />
        </div>
        {error && <NotFound />}
      </div>
    </div>
  );
};

export default AddRecipe;
