"use client";

import { Modal } from "@/components/ui/Modal";
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

  return <div className="p-4">Root Page</div>;
}
