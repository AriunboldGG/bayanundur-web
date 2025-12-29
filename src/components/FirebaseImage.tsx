"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/products";

interface FirebaseImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  [key: string]: any;
}

export default function FirebaseImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  ...props
}: FirebaseImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      if (!src) return;
      
      // If already a full URL, use it directly
      if (src.startsWith("http://") || src.startsWith("https://")) {
        setImageUrl(src);
        setIsLoading(false);
        return;
      }

      // If it's a local path (starts with /), use it directly
      if (src.startsWith("/")) {
        setImageUrl(src);
        setIsLoading(false);
        return;
      }

      // Otherwise, try to get from Firebase Storage
      try {
        const url = await getImageUrl(src);
        setImageUrl(url);
      } catch (error) {
        console.warn(`Failed to load image from Firebase Storage: ${src}`, error);
        // Fallback to local path
        setImageUrl(src.startsWith("/") ? src : `/images/${src}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [src]);

  // Show placeholder while loading
  if (isLoading && !imageUrl.startsWith("/")) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={fill ? undefined : { width, height }}>
        {!fill && <div style={{ width, height }} />}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={imageUrl.startsWith("http")}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={imageUrl.startsWith("http")}
      {...props}
    />
  );
}

