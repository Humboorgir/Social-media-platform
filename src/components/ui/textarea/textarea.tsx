import * as React from "react";

import { cn } from "~/lib/utils";

export type TextAreaProps = React.ComponentProps<"textarea">;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <div className={cn("relative h-fit w-fit", className)}>
        <textarea
          className="focus:ring-offset-3 focus:border-3 peer bottom-0 left-0 right-0 top-0 flex w-full resize-none rounded-md border border-ring bg-background px-3 py-2.5 text-foreground ring-offset-background transition-[border] placeholder:text-transparent focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        <label className="pointer-events-none absolute left-[8px] top-0 z-10 -translate-y-1/2 bg-background px-1 text-xs text-foreground-muted transition-all peer-placeholder-shown:left-[13px] peer-placeholder-shown:top-[20px] peer-placeholder-shown:text-base peer-focus:!left-[8px] peer-focus:!top-0 peer-focus:!text-xs peer-focus:text-primary">
          {placeholder}
        </label>
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

export default TextArea;
