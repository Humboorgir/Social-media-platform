import * as React from "react";

import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <div className={cn("relative h-fit w-fit", className)}>
        <input
          type={type}
          className="bg-background ring-offset-background border-ring focus:ring-offset-3 focus:border-3 focus:border-primary text-foreground peer bottom-0 left-0 right-0 top-0 flex w-full rounded-md border px-3 py-2.5 transition-[border] placeholder:text-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        <label className="bg-background peer-focus:text-primary text-foreground pointer-events-none absolute left-[8px] top-0 z-10 translate-y-[-50%] px-1 text-xs transition-all peer-placeholder-shown:left-[13px] peer-placeholder-shown:top-[50%] peer-placeholder-shown:text-base peer-focus:!left-[8px] peer-focus:!top-0 peer-focus:!text-xs">
          {placeholder}
        </label>
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
