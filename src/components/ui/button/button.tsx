// TODO: implement color variant

import * as React from "react";
import Link from "next/link";

import Ripple from "./ripple";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-md font-base
  whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none 
  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
   disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden`,
  {
    variants: {
      /**
       * The button style of your choice.
       */
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-foreground hover:bg-secondary/80",
        outline: "border border-ring text-foreground bg-background hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * How large should the button be?
       */
      size: {
        default: "text-base px-3 py-2",
        sm: "text-sm rounded-md px-2 py-1.5",
        lg: "text-xl rounded-md px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Color used for the button's ripple effect.
     */
    rippleColor?: string;
    /**
     * Url to redirect to on button click.
     */
    href?: string;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, rippleColor, href, ...props }, ref) => {
    const Component = href ? Link : "button";
    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        {...(href ? { href } : {})}
        // @ts-ignore
        ref={ref}
        {...props}>
        <Ripple rippleColor={rippleColor} />
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
export default Button;
