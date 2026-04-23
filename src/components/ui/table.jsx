import * as React from "react";
import { cn } from "../../lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border border-[#e5e7eb]">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
));

Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn("[&_tr]:border-b [&_tr]:border-[#e5e7eb]", className)}
        {...props}
    />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));

TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t border-[#e5e7eb] bg-[#f9fafb] font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
));

TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-[#e5e7eb] transition-colors hover:bg-[#f9fafb]",
            className
        )}
        {...props}
    />
));

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-11 px-4 text-left align-middle text-sm font-medium text-[#6b7280]",
            className
        )}
        {...props}
    />
));

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle text-sm", className)}
        {...props}
    />
));

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-[#6b7280]", className)}
        {...props}
    />
));

TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};