import Button from "~/components/ui/button";

import React, {
  useContext,
  useState,
  createContext,
  memo,
  useMemo,
  useEffect,
  useRef,
} from "react";
import usePrevious from "~/hooks/usePrevious";
import { cn } from "~/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { ButtonProps } from "~/components/ui/button/button";

type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

type TTabsContext = {
  active: string;
  setActive: ReactSetState<string>;
  tabs: string[];
  setTabs: ReactSetState<string[]>;
};

const TabsContext = createContext<TTabsContext>({
  active: "",
  setActive: () => {},
  tabs: [],
  setTabs: () => {},
});

export type TabsProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /**
   * Which tab should be open by default?
   */
  openByDefault: string;
  /**
   * A function that runs everytime the active tab changes.
   */
  onChange?: (selected: string) => void;
};

export const Tabs = ({
  openByDefault,
  onChange,
  children,
  className,
}: TabsProps) => {
  const [active, setActive] = useState(openByDefault);
  const [tabs, setTabs] = useState<string[]>([]);

  useEffect(() => {
    if (onChange) onChange(active);
  }, [active]);

  const tabsContext = useMemo(
    () => ({ active, setActive, tabs, setTabs }),
    [active, setActive, tabs, setTabs],
  );
  return (
    <TabsContext.Provider value={tabsContext}>
      <div className={cn("relative flex h-fit w-min flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export type TabsTriggerProps = ButtonProps & {
  /**
   * Specifies the trigger's corresponding tab.
   */
  value: string;
};

export const TabsTrigger = memo(function TabsTrigger({
  children,
  className,
  variant = "outline",
  value,
  ...props
}: TabsTriggerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef<boolean>(true);
  const { active, setActive } = useContext(TabsContext);

  const isActive = active == value;

  // Prevents focus on the first render
  // Removing this would cause the focus to be triggered on page load
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isActive) buttonRef.current?.focus();
  }, [isActive]);

  function activateTab() {
    setActive(value);
  }

  return (
    <Button
      role="tab"
      id={`${value}-trigger`}
      tabIndex={isActive ? 0 : -1}
      aria-controls={`${value}-content`}
      aria-selected={isActive}
      className={cn("mr-3 last-of-type:mr-0", className)}
      onClick={activateTab}
      onFocus={activateTab}
      variant={variant}
      ref={buttonRef}
      {...props}
    >
      {children}
    </Button>
  );
});

export type TabsListProps = React.ComponentProps<"div">;

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
  const { active, setActive } = useContext(TabsContext);
  const { tabs } = useContext(TabsContext);

  const handleKeyboardNavigation: React.KeyboardEventHandler<HTMLDivElement> = (
    e,
  ) => {
    const activeTab = tabs.find((tab) => tab == active);

    if (e.key === "ArrowRight") {
      // If we've reached the end of the tablist:
      if (tabs.indexOf(active) == tabs.length - 1) {
        // @ts-ignore
        return setActive(tabs[0]);
      }
      // Otherwise:
      // @ts-ignore
      setActive(tabs[tabs.indexOf(activeTab!) + 1]);
    } else if (e.key === "ArrowLeft") {
      // @ts-ignore
      // If we've reached the beginning of the tablist:
      if (tabs.indexOf(active) == 0) {
        // @ts-ignore
        return setActive(tabs[tabs.length - 1]);
      }
      // Otherwise:
      // @ts-ignore
      setActive(tabs[tabs.indexOf(activeTab!) + -1]);
    }
  };
  return (
    <div
      role="tablist"
      onKeyDown={handleKeyboardNavigation}
      className={cn("flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export type TabsContentProps = HTMLMotionProps<"div"> & {
  /**
   * A unique string.
   */
  value: string;
};

export const TabsContent = ({
  children,
  className,
  value,
  ...props
}: TabsContentProps) => {
  const { tabs, setTabs, active } = useContext(TabsContext);
  const prevSelected = usePrevious(active);

  useEffect(() => {
    setTabs((prev) => [...prev, value]);

    return () => {
      setTabs((prev) => {
        if (prev.length) {
          prev.pop();
          return prev;
        }
        return prev;
      });
    };
  }, []);

  const isActive = active == value;
  if (!isActive) return null;

  const prevSelectedTabIndex = tabs.findIndex((tab) => tab == prevSelected);
  const currentTabIndex = tabs.findIndex((tab) => tab == value);
  // Directional aware transition
  const initialX = currentTabIndex > prevSelectedTabIndex ? 20 : -20;

  return (
    isActive && (
      <motion.div
        role="tabpanel"
        aria-labelledby={`${value}-trigger`}
        id={`${value}-content`}
        tabIndex={0}
        initial={{ opacity: 0, x: initialX }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
        className={cn("left-0 top-full mt-2 w-full", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  );
};
