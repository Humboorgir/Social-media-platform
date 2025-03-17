"use client";

import type { VariantProps } from "class-variance-authority";

import React, { useId, useRef, useState } from "react";
import Button, { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useClickOutside } from "~/hooks/useClickOutside";
import DropdownMenu from "./dropdown-menu";

export type DropdownProps = React.ComponentProps<"div"> & {
  /**
   * classNames to apply to the dropdown trigger
   */
  triggerClassName?: string;
  /**
   * classNames to apply to the dropdown menu
   */
  menuClassName?: string;
  /**
   * Variant of the trigger button.
   */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /**
   * List of links to display
   */
  links: { name: string; href?: string; onClick?: React.MouseEventHandler }[];
};

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      className,
      triggerClassName,
      menuClassName,
      variant = "outline",
      links,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    // Used purely for accessibility-related purposes
    const [focused, setFocused] = useState(links[0]);
    const triggerRef = useRef<HTMLButtonElement>(null);

    function toggleOpen(customIsOpen?: boolean) {
      // while opening:
      if (!isOpen) setFocused(links[0]);
      // while closing:
      if (isOpen) triggerRef.current?.focus();
      if (typeof customIsOpen == "boolean") setIsOpen(customIsOpen);
      else setIsOpen((prev) => !prev);
    }

    const numberOfLinks = links.length;
    const moveFocusUp = () => {
      // @ts-ignore
      if (links.indexOf(focused) > 0) {
        // @ts-ignore
        return setFocused(() => links[links.indexOf(focused) - 1]);
      }
      setFocused(links[numberOfLinks - 1]);
    };

    const moveFocusDown = () => {
      // @ts-ignore
      if (links.indexOf(focused) < numberOfLinks - 1) {
        // @ts-ignore
        return setFocused(() => links[links.indexOf(focused) + 1]);
      }
      setFocused(links[0]);
    };

    const clickOutsideRef = useClickOutside(() => toggleOpen(false));

    // Merge forwarded ref and clickOutsideRef
    const setRefs = (node: HTMLDivElement | null) => {
      // Handle forwarded ref
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // Handle clickOutsideRef
      if (clickOutsideRef) {
        (
          clickOutsideRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
      }
    };

    // unique component ID, used for accessibility-related purposes.
    const id = useId();
    const triggerId = `${id}-trigger`;
    const menuId = `${id}-menu`;
    return (
      <div
        // Handling keyboard interactions
        onKeyDown={(e) => {
          if (!isOpen) return;
          const { key } = e;
          if (key == "Escape") return toggleOpen(false);
          // To prevent scrolling:
          if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(key))
            e.preventDefault();
          if (key == "ArrowUp") return moveFocusUp();
          if (key == "ArrowDown") return moveFocusDown();
        }}
        ref={setRefs}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <Button
          onKeyDown={(e) => {
            if (e.key == "ArrowDown") {
              e.preventDefault();
              toggleOpen(true);
            }
          }}
          ref={triggerRef}
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-haspopup="menu"
          className={triggerClassName}
          variant={variant}
          onClick={() => toggleOpen()}
        >
          {children}
        </Button>

        <DropdownMenu
          // @ts-ignore
          focused={focused}
          menuId={menuId}
          isOpen={isOpen}
          toggleOpen={toggleOpen}
          menuClassName={menuClassName}
          links={links}
        />
      </div>
    );
  },
);

export default Dropdown;
