// on the server the windows object doesnt exist

import { useState, useEffect } from "react";

export default function UseOrigin() {
  const [isMounted, setIsMounted] = useState(false);

  const useOrigin =
    // checking if window is available, if it is, checking if origin is true,
    // and if it is, using that origin
    // origin provides base url of the current page
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "";
  }

  return origin;
}
