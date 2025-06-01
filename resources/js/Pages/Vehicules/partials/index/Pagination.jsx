import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ data, filters, onChange }) {
  const { current_page, last_page } = data;

  const handlePage = (page) => {
    onChange({ ...filters, page });
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          disabled={current_page <= 1}
          onClick={() => handlePage(current_page - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={current_page >= last_page}
          onClick={() => handlePage(current_page + 1)}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{current_page}</span> of{" "}
            <span className="font-medium">{last_page}</span>
          </p>
        </div>
        <div>
          <button
            onClick={() => handlePage(current_page - 1)}
            disabled={current_page <= 1}
            className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePage(current_page + 1)}
            disabled={current_page >= last_page}
            className="ml-3 inline-flex items-center px-2 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
