import { clsx } from "clsx"
export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx("h-9 w-full rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-primary", className)} {...props}/>
}
