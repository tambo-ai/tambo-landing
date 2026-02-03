"use client";

import { useEffect } from "react";
import { useStore } from "~/libs/store";
import { Navigation } from "~/app/(pages)/_components/navigation";

export function BlogNavWrapper() {
  const setHasAppeared = useStore((state) => state.setHasAppeared);

  useEffect(() => {
    setHasAppeared(true);
  }, [setHasAppeared]);

  return <Navigation />;
}
