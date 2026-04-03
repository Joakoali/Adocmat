import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-gold-400",
        dark: "bg-primary text-primary-foreground hover:bg-navy-700",
        outline:
          "border border-white/25 text-white hover:border-gold-400 hover:text-gold-400",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
        danger: "bg-destructive text-white hover:opacity-90",
        goldBorder:
          "border border-gold-500/40 text-gold-400 hover:border-gold-400 hover:text-gold-300",
      },
      size: {
        sm: "text-xs px-4 py-2 rounded-full",
        md: "text-sm px-6 py-2.5 rounded-full",
        lg: "text-sm px-8 py-3.5 rounded-full",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

interface LinkButtonProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
