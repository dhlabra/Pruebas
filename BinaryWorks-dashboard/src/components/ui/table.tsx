export const Table = (p: React.HTMLAttributes<HTMLTableElement>) => <table className="w-full text-sm" {...p}/>
export const TableHeader = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="text-left text-neutral-400" {...p}/>
export const TableBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p}/>
export const TableRow = (p: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="border-t border-border" {...p}/>
export const TableHead = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="py-2 font-normal" {...p}/>
export const TableCell = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="py-2" {...p}/>
