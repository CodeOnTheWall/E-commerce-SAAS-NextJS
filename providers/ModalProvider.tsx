"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/StoreModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect always runs after component has been loaded, hence isMounted
  // will be true
  // this is to avoid hydration errors, between what is loaded on client and server
  // so if im still in server side rendering, return null, since this useEffect
  // wont run until after component renders (client side)
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
};
