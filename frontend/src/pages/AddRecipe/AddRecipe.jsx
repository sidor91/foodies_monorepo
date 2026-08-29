import AddRecipeForm from "../../components/AddRecipeForm/AddRecipeForm";
import PathInfo from "../../components/PathInfo/PathInfo";
import MainTitle from "../../components/MainTitle/MainTitle";
import Subtitle from "../../components/Subtitle/Subtitle";
import {
  selectCurrentRecipeError,
  selectCurrentRecipeIsLoading,
} from "../../../redux/recipes/recipesSelectors.js";
import { useSelector } from "react-redux";
import NotFound from "../NotFound/NotFound.jsx";
import css from "./AddRecipe.module.css";
import ThreeDots from "../../components/Loader/Loader.jsx";

const AddRecipe = () => {
  const error = useSelector(selectCurrentRecipeError);
  const isLoading = useSelector(selectCurrentRecipeIsLoading);

  return (
    <div className={css.section}>
      <div className={css.container}>
        {error ? (
          <NotFound />
        ) : (
          <>
            <div className="flex w-full flex-col items-start">
              <PathInfo
                currentPage="Add Recipe"
                className="flex justify-start mb-[3.2rem] tablet:mb-[4rem] mt-[4.8rem]"
              />
              <MainTitle className="mb-[1.6rem] tablet:mb-[2rem]">Add Recipe</MainTitle>
              <Subtitle className="mb-[3.2rem]  tablet:mb-[4rem]" />
            </div>

            <section className="flex w-full justify-center">
              <AddRecipeForm />
            </section>

            {error && <NotFound />}
          </>
        )}
        {isLoading && <ThreeDots />}
      </div>
    </div>
  );
};

export default AddRecipe;
