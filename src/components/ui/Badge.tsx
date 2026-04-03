import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold border",
  {
    variants: {
      variant: {
        gold: "bg-gold-500/15 text-gold-600 border-gold-500/30",
        navy: "bg-navy-50 text-navy-600 border-navy-100",
        success: "bg-emerald-50 text-emerald-600 border-emerald-200",
        muted: "bg-muted text-muted-foreground border-border",
        outline: "bg-transparent text-white/40 border-white/15",
      },
      size: {
        sm: "text-xs px-2.5 py-0.5 rounded-full",
        md: "text-xs px-3 py-1 rounded-full",
      },
    },
    defaultVariants: {
      variant: "muted",
      size: "md",
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
