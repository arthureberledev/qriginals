"use client";

import { useEffect } from "react";

import { PageNotFound } from "~/components/page-not-found";

export default function Error(props: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(props.error);
  }, [props.error]);

  return <PageNotFound />;
}
