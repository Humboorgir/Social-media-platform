"use client";

import type { DropdownProps } from "./dropdown";

import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import Button, { buttonVariants } from "~/components/ui/button";
import { useEffect, useRef } from "react";

type Link = DropdownProps["links"][0];
type SelectOptionProps = {
  isOpen: boolean;
  toggleOpen: () => void;
  menuId: string;
  links: Link[];
  focused: Link;
  menuClassName?: string;
};

export default function DropdownMenu({
  isOpen,
  toggleOpen,
  menuId,
  links,
  focused,
  menuClassName,
}: SelectOptionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          id={menuId}
          role="menu"
          initial={{
            opacity: 0,
            scale: 0.87,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.25,
            delay: 0.1,
            ease: [0.76, 0, 0.24, 1],
          }}
          className={cn(
            `absolute right-0 top-full mt-2 w-52 origin-top-right divide-y divide-foreground/10 overflow-hidden rounded-md border border-ring bg-background`,
            menuClassName,
          )}
        >
          {links.map((item, i) => {
            const itemRef = useRef<HTMLButtonElement>(null);
            useEffect(() => {
              if (focused.name != item.name) return;
              itemRef.current?.focus();
            }, [focused]);

            return (
              <li role="menuitem" key={i}>
                <Button
                  onKeyDown={(e) => {
                    // Space wouldn't work here for some reason. Using " " fixed the problem.
                    // TODO: investigate this further.
                    if (["Enter", " "].includes(e.key)) {
                      e.preventDefault();
                      itemRef.current?.click();
                    }
                  }}
                  tabIndex={-1}
                  ref={itemRef}
                  onClick={(e) => {
                    toggleOpen();
                    if (item.onClick) item.onClick(e);
                  }}
                  variant="outline"
                  className="h-full w-full justify-start rounded-none px-4 py-2 focus-visible:bg-secondary focus-visible:ring-0"
                  {...(item.href ? { href: item.href } : {})}
                >
                  {item.name}
                </Button>
              </li>
            );
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
