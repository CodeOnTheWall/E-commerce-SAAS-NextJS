"use client";

import { Loader } from "@/components/ui/Loader";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader />
    </div>
  );
};

export default Loading;
