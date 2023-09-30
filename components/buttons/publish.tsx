"use client";

import { SendIcon } from "~/app/icons";
import { Button } from "./generic";

export function PublishButton() {
  return (
    <Button variant="default" className="flex items-center">
      <SendIcon className="mr-1.5 h-4 w-4" />
      <span>Publish</span>
    </Button>
  );
}
