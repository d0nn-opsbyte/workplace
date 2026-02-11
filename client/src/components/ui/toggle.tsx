import * as React from 'react';
import { cn } from '../../lib/utils';

const variantStyles = {
  default: 'bg-transparent',
  outline: 'border border-gray-300 bg-transparent shadow-sm hover:bg-gray-100',
};

const sizeStyles = {
  default: 'h-9 px-2 min-w-9',
  sm: 'h-8 px-1.5 min-w-8',
  lg: 'h-10 px-2.5 min-w-10',
};

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant = 'default', size = 'default', pressed, onPressedChange, onClick, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(false);
    const isPressed = pressed !== undefined ? pressed : internalPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;
      setInternalPressed(newPressed);
      onPressedChange?.(newPressed);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
          isPressed && 'bg-gray-200',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

Toggle.displayName = 'Toggle';

export { Toggle };
