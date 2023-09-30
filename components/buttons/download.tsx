"use client";

import saveAs from "file-saver";

import { DownloadCloudIcon } from "~/app/icons";
import { Button } from "./generic";

function handleDownload(url: string) {
  saveAs(url, "qriginals.png");
}

export function DownloadButton(props: { url: string }) {
  return (
    <Button
      onClick={() => handleDownload(props.url)}
      variant="outline"
      className="flex items-center"
    >
      <div className="mr-1.5 h-4 w-4">
        <DownloadCloudIcon />
      </div>
      <span>Download</span>
    </Button>
  );
}
