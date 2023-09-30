"use client";

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import { useState } from "react";

import { Share2Icon } from "~/app/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "./generic";

export function ShareButton(props: { url: string; quote: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Share"
          data-balloon-pos="down"
          type="button"
          variant="ghost"
          className="rounded-lg w-fit  h-full aspect-1 bg-white p-2 sm:p-3 border border-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-600"
        >
          <Share2Icon className="w-5 h-5 stroke-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Select a social media platform to share your creation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row flex-wrap gap-3">
          <FacebookShareButton url={props.url} quote={props.quote}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <PinterestShareButton url={props.url} media={props.quote}>
            <PinterestIcon size={32} round />
          </PinterestShareButton>
          <RedditShareButton url={props.url} title={props.quote}>
            <RedditIcon size={32} round />
          </RedditShareButton>
          <TelegramShareButton url={props.url} title={props.quote}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <TwitterShareButton url={props.url} title={props.quote}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton
            url={props.url}
            title={props.quote}
            separator=":: "
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={props.url}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
