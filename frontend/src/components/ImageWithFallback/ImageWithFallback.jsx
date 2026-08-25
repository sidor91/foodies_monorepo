import { useState } from "react";
import clsx from "clsx";

import css from "./ImageWithFallback.module.css";

// shows a grey placeholder box (matching the target size/shape via `className`)
// while the image is loading or if it fails to load, avoiding layout shift
const ImageWithFallback = ({ src, alt = "", className, placeholder = "default", ...imgProps }) => {
  const [status, setStatus] = useState(src ? "loading" : "error");
  const isAvatarPlaceholder = placeholder === "avatar";

  if (status !== "loaded") {
    return (
      <div
        className={clsx(css.placeholder, isAvatarPlaceholder && css.avatarPlaceholder, className)}
        role="img"
        aria-label={alt || undefined}
      >
        {isAvatarPlaceholder && (
          <svg className={css.avatarIcon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </svg>
        )}
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
