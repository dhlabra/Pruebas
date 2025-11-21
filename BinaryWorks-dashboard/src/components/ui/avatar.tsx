function initials(name: string) {
  return name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()
}
export function Avatar({ name }: { name: string }) {
  return (
    <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-xs font-semibold">
      {initials(name)}
    </div>
  )
}
