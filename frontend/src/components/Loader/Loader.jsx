import { ThreeDots } from "react-loader-spinner";
import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loader}>
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#362121"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{ transform: "scale(1)" }}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
