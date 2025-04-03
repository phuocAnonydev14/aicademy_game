import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { renderGoogleSignIn, useProfile } from "@/services/auth.service";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { useCallback, useRef, useState } from "react";
import { FormLoginEmail } from "./form-login-email";
import { NavUser } from "./nav-user";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";

export function SiteHeader() {
  const button = useRef<HTMLDivElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const onLoginOpenChange = useCallback(
    (isOpen: boolean) => {
      setLoginOpen(isOpen);
      if (!isOpen) {
        return;
      }

      setTimeout(() => {
        renderGoogleSignIn(button.current);
      }, 100);
    },
    [setLoginOpen],
  );
  const profile = useProfile();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-4 px-4 container">
        <Navbar />

        <DropdownMenu open={loginOpen} onOpenChange={onLoginOpenChange}>
          <DropdownMenuTrigger asChild>
            {profile.data && "data" in profile.data ? (
              <NavUser user={profile.data.data} />
            ) : (
              <Button className="rounded-full px-8">Start</Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            collisionPadding={5}
            sideOffset={2}
            align="end"
            className="w-60"
          >
            <DropdownMenuLabel className="text-center">
              Sign in to start learning 📚
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuArrow className="fill-foreground/50" />
            <div className="flex flex-col items-center hover:bg-background p-2">
              <div ref={button} className="text-sm w-full">
                Google
              </div>
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full my-4" />
                <div className="absolute px-2 -translate-x-1/2 bg-background left-1/2 text-xs font-medium text-foreground/40">
                  OR
                </div>
              </div>
              <FormLoginEmail
                onSuccess={() => {
                  setLoginOpen(false);
                }}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
