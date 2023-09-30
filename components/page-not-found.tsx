import Link from "next/link";

import { GALLERY_PAGE, SUPPORT_PAGE } from "~/lib/constants/routes";
import { Button } from "./buttons/generic";
import { Container } from "./container";

export function PageNotFound() {
  return (
    <Container>
      <div className="text-center">
        <p className="text-base font-semibold text-gray-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href={GALLERY_PAGE}>Go back home</Link>
          </Button>
          <Link
            href={SUPPORT_PAGE}
            className="text-sm font-semibold text-gray-900"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </Container>
  );
}
