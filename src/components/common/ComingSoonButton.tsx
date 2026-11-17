"use client";

import type { ComponentProps } from "react";
import { useToast } from "./Toast";

type ComingSoonButtonProps = Omit<ComponentProps<"button">, "onClick" | "type"> & {
  featureName: string;
};

export function getComingSoonMessage(featureName: string) {
  return `'${featureName}' 준비 중이에요. 곧 만나요!`;
}

export function ComingSoonButton({ featureName, ...buttonProps }: ComingSoonButtonProps) {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => showToast(getComingSoonMessage(featureName))}
      {...buttonProps}
    />
  );
}
