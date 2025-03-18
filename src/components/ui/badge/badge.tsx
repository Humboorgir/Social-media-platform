import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const badgeVariants = cva(
  `inline-flex items-center rounded-full
    transition-colors focus:outline-none focus:ring-2 
   focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      /**
       * The Badge style of your choice.
       */
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-foreground",
        success:
          "bg-green-600/20 text-green-600 dark:bg-green-400/20 dark:text-green-400",
        danger:
          "bg-red-600/20 text-red-600 dark:bg-red-400/20 dark:text-red-400",
        warning:
          "bg-yellow-500/20 text-amber-600 dark:bg-yellow-300/20 dark:text-yellow-400",
      },
      /**
       * Determines how large the badge should be
       */
      size: {
        sm: "text-xs px-2.5 py-1",
        md: "text-sm px-3 py-1",
        lg: "text-base px-3 py-1",
        xl: "text-lg px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type BadgeProps = React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { badgeVariants };
export default Badge;
