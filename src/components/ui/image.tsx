import { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, ".webp");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
      )}
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className={`transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </picture>
    </div>
  );
};
