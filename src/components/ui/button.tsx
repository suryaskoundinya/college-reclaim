import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
        outline:
          "border-2 border-violet-200 bg-background shadow-sm hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:text-white dark:hover:text-white transform hover:-translate-y-0.5",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
        ghost:
          "hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-accent/50 dark:text-gray-300 dark:hover:text-white transform hover:scale-105",
        link: "text-violet-600 underline-offset-4 hover:underline hover:text-violet-700 transform hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4 text-base font-semibold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.memo(React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}))

Button.displayName = "Button"

export { Button, buttonVariants }
