"use client";

import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import React from "react";

type SkeletonProps = React.ComponentProps<"div">;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "relative inline-flex w-full overflow-hidden rounded-sm leading-none",
          className,
        )}
        style={{ backgroundColor: "hsl(var(--skeleton-base))" }}
        aria-live="polite"
        aria-busy="true"
        {...props}
      >
        {/* Invisible character */}
        &zwnj;
        <motion.span
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="dark:[] absolute left-0 right-0 top-0 block h-full"
          style={{
            backgroundImage: `linear-gradient(90deg,
           hsl(var(--skeleton-base)) 0%,
           hsl(var(--skeleton-highlight)) 50%,
           hsl(var(--skeleton-base)) 100%)`,
          }}
        />
      </span>
    );
  },
);

export default Skeleton;
