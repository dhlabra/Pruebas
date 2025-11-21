import { clsx } from "clsx"
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx("h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm outline-none focus:border-primary", className)} {...props}/>
}
