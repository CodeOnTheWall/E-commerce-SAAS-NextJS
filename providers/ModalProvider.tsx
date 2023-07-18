"use client";

import { useEffect, useState } from "react";

import StoreModal from "@/components/modals/StoreModal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect always runs after component has been loaded, hence isMounted
  // will be true after the initial render
  // this is to avoid hydration errors, between what is loaded on client and server
  // essentially dont want to setIsMounted to true until the server side
  // has completely loaded
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // if mounted, return StoreModal
  return (
    <>
      <StoreModal />
    </>
  );
}
