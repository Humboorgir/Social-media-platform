import React from "react";

import { cn } from "~/lib/utils";

export type ContainerProps = React.HTMLProps<HTMLDivElement>;

/** Used to center items on a page. responsive by default. */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn("mx-auto w-fit max-w-screen-xl px-6 sm:px-8", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";

export default Container;
