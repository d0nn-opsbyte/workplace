import * as React from 'react';
import { cn } from '../../lib/utils';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface TooltipProps {
  children: React.ReactNode;
}

const Tooltip = ({ children }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const context = React.useContext(TooltipContext);

    return (
      <button
        ref={ref}
        type="button"
        onMouseEnter={(e) => {
          context?.setOpen(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          context?.setOpen(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TooltipTrigger.displayName = 'TooltipTrigger';

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, children, ...props }, ref) => {
    const context = React.useContext(TooltipContext);

    if (!context?.open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white',
          'bottom-full left-1/2 -translate-x-1/2',
          className,
        )}
        style={{ marginBottom: sideOffset }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
