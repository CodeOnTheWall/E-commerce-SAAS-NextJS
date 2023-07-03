"use client";

import { useStoreModal } from "@/hooks/UseStoreModal";
import { useEffect } from "react";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  // dont need to return anything as only using this page to
  // trigger the modal
  return null;
}
