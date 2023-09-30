"use client";

import {
  ArrowLeftOnRectangleIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BoxesIcon, User2Icon } from "~/app/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { Button } from "~/components/buttons/generic";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu";
import {
  ACCOUNT_PAGE,
  COLLECTIONS_PAGE,
  CREDITS_PAGE,
} from "~/lib/constants/routes";

import type { Database } from "~/lib/types/db";

const navigationItems = [
  {
    name: "Buy Credits",
    href: CREDITS_PAGE,
    icon: CreditCardIcon,
  },
  {
    name: "Collection",
    href: COLLECTIONS_PAGE,
    icon: BoxesIcon,
  },
  {
    name: "Account",
    href: ACCOUNT_PAGE,
    icon: User2Icon,
  },
];

export function UserNavigation(props: {
  email: string | null;
  credits: number | null;
  username: string | null;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative rounded-full aspect-1 p-0 w-8 h-8"
        >
          <Avatar className="relative flex items-center justify-center w-8 h-8">
            <AvatarImage
              className="w-8 h-8 aspect-1"
              src={props.avatarUrl ?? ""}
              alt={`Avatar Image of ${props.username}`}
            />
            <AvatarFallback className="aspect-1 w-8 h-8 text-base text-center inline-flex items-center pl-px justify-center">
              {props.username?.[0].toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none text-gray-900">
              {props.username ?? ""}
            </p>
            <p className="mt-2 text-sm leading-none text-gray-600">
              {props.credits ?? ""} Credits
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navigationItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              disabled={pathname?.includes(item.href)}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
