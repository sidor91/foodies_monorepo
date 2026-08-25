import { useState } from "react";
import clsx from "clsx";

import css from "./ImageWithFallback.module.css";

// shows a grey placeholder box (matching the target size/shape via `className`)
// while the image is loading or if it fails to load, avoiding layout shift
const ImageWithFallback = ({ src, alt = "", className, ...imgProps }) => {
  const [status, setStatus] = useState(src ? "loading" : "error");

  if (status !== "loaded") {
    return (
      <div className={clsx(css.placeholder, className)} role="img" aria-label={alt || undefined}>
        {src && (
          <img
            src={src}
            alt=""
            className={css.probe}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setStatus("error")}
      {...imgProps}
    />
  );
};

export default ImageWithFallback;
