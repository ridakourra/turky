import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ data, filters, onChange }) {
    const {
        current_page,
        last_page,
        per_page,
        from,
        to,
        total
    } = data;

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= last_page) {
            onChange({
                ...filters,
                page: page
            });
        }
    };

    // Handle per page change
    const handlePerPageChange = (newPerPage) => {
        onChange({
            ...filters,
            per_page: newPerPage,
            page: 1 // Reset to first page when changing per page
        });
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (last_page <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Calculate start and end page numbers
            let start = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
            let end = Math.min(last_page, start + maxVisiblePages - 1);

            // Adjust start if we're near the end
            if (end - start < maxVisiblePages - 1) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            // Add first page and ellipsis if needed
            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('...');
                }
            }

            // Add page numbers
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis and last page if needed
            if (end < last_page) {
                if (end < last_page - 1) {
                    pages.push('...');
                }
                pages.push(last_page);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (last_page <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results info */}
            <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{from}</span> à{' '}
                <span className="font-medium">{to}</span> sur{' '}
                <span className="font-medium">{total}</span> résultats
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Per page selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Par page:</span>
                    <Select
                        value={per_page.toString()}
                        onValueChange={(value) => handlePerPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="w-16">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                    {/* First page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={current_page === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(current_page - 1)}
                        disabled={current_page === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    {pageNumbers.map((page, index) => (
                        <Button
                            key={index}
                            variant={page === current_page ? "default" : "outline"}
                            size="sm"
                            onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                            disabled={page === '...'}
                            className={`h-8 min-w-8 px-2 ${
                                page === current_page
                                    ? "bg-[#f9c401] hover:bg-[#e0b001] text-[#262626] border-[#f9c401]"
                                    : ""
                            }`}
                        >
                            {page}
                        </Button>
                    ))}

                    {/* Next page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(current_page + 1)}
                        disabled={current_page === last_page}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(last_page)}
                        disabled={current_page === last_page}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
