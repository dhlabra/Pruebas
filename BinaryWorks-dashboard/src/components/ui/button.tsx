import { clsx } from "clsx"
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"outline"|"ghost" }
export function Button({ className, variant="default", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md text-sm h-9 px-3 transition"
  const styles = {
    default: "bg-primary text-white hover:opacity-90",
    outline: "border border-border hover:bg-muted",
    ghost: "hover:bg-muted"
  }[variant]
  return <button className={clsx(base, styles, className)} {...props} />
}
