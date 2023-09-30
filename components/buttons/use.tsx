import Link from "next/link";

import { QRCodeIcon } from "~/app/icons";
import { CREATE_PAGE } from "~/lib/constants/routes";
import { Button } from "./generic";

export function UseButton(props: { creationId: string }) {
  return (
    <Button
      aria-label="Use"
      data-balloon-pos="down"
      variant="ghost"
      className="rounded-lg h-full w-fit aspect-1 bg-white border border-gray-200 p-2 sm:p-3 hover:bg-gray-200 text-gray-600 hover:text-gray-600"
      asChild
    >
      <Link href={`${CREATE_PAGE}/${props.creationId}`}>
        <QRCodeIcon className="w-5 h-5 stroke-2 relative" />
      </Link>
    </Button>
  );
}
