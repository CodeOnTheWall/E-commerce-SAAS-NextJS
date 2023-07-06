"use client";

import { Copy, Server } from "lucide-react";
import { toast } from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";

interface ApiAlertProps {
  title: string;
  description: string;
  // because it can be an env variable, or a api route
  variant: "public" | "admin";
}

// Record<Keys, Type> via ts docs
// Constructs an object type whose property keys are Keys and whose
// property values are Type. This utility can be used to map the properties
// of a type to another type.
// in this case, we are picking variant as the property key,
// and giving its property values type string
// so public is the key, and Public is the value as a string
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export default function ApiAlert({
  title,
  description,
  // making public default
  variant = "public",
}: ApiAlertProps) {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API route copied to the clipboard");
  };

  return (
    <Alert>
      <Server className=" h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className=" mt-4 flex items-center justify-between">
        <code className=" relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className=" h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
