"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";

// for cloudinary, go to upload, upload preset, and make sure its unsigned, not signed
// add upload preset code to upload preset
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect always runs after component has been loaded, hence isMounted
  // will be true
  // this is to avoid hydration errors, between what is loaded on client and server
  // so if im still in server side rendering, return null, since this useEffect
  // wont run until after component renders (client side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className=" mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className=" relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className=" z-10 absolute top-2 ring-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className=" h-4 w-4 " />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="udmgduog">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
