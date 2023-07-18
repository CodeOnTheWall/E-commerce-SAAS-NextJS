"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  // void means a function that takes no arguments and doesnt return any value
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  // isOpen is set to true via the root page

  const onChange = (open: boolean) => {
    // open will be false since onOpenChange (clicking outside modal, or the
    // built in x) auto passes open as false
    // !false = true
    if (!open) {
      // sets isOpen back to false
      onClose();
    }
  };

  return (
    // open and onOpenChange are expected props from shadcn for Dialog
    // clicking outside the box and on the built in x causes onOpenChange
    // event to trigger, which causes open to be false automatically
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
