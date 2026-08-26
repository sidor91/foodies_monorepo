import Icon from "../Icon/Icon";

const ImageUploader = ({ previewUrl, handleImageUpload, setFieldValue }) => {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div
        className=" w-full max-w-[34.3rem] tablet:max-w-[70.4rem] desktop:w-[55.1rem] h-[31.8rem] 
          tablet:h-[40rem] desktop:h-[40rem] rounded-[3rem] border border-dashed
         border-(--gray) overflow-hidden mb-[3.2rem] shrink-0"
      >
        <label className="pointer-events-auto w-full h-full cursor-pointer flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
          ) : (
            <div className="mx-auto flex flex-col items-center justify-center gap-[0.8rem] ">
              <Icon
                name="add-image"
                size={50}
                className="fill-(--black)/20 tablet:w-[6.4rem] tablet:h-[6.4rem]"
              />
              <span
                className="text-[1.4rem] tablet:text-[1.6rem] block leading-[143%] tablet:leading-[150%] underline
                     text-(--black)"
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
            tablet:leading-[150%] underline text-(--black)"
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
