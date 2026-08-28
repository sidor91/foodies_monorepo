import Icon from "../Icon/Icon";
import { clsx } from "clsx";

const ImageUploader = ({ previewUrl, handleImageUpload, setFieldValue }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(`
          w-full max-w-[34.3rem] tablet:max-w-[70.4rem] desktop:w-[55.1rem] h-[31.8rem]
          tablet:h-[40rem] desktop:h-[40rem] rounded-[3rem]
          border-(--gray) overflow-hidden ${
            previewUrl
              ? "mb-[1.6rem] tablet:mb-[2rem]"
              : "mb-[3.2rem] tablet:mb-[8rem] border border-dashed"
          }`)}
      >
        <label className="pointer-events-auto h-full cursor-pointer flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-[0.8rem]">
              <Icon
                name="add-image"
                size={50}
                className="fill-secondary tablet:w-[6.4rem] tablet:h-[6.4rem]"
              />
              <span
                className="text-[1.4rem] tablet:text-[1.6rem] block leading-[143%] tablet:leading-[150%] underline
                     text-accent"
              >
                Upload a photo
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, setFieldValue)}
          />
        </label>
      </div>
      {previewUrl && (
        <label className="cursor-pointer mb-[3.2rem]">
          <span
            className="text-[1.4rem] tablet:text-[1.6rem] block leading-[143%] 
            tablet:leading-[150%] underline text-accent"
          >
            Upload another photo
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, setFieldValue)}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
