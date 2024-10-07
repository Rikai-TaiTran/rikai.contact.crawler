import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

interface paginationProps {
  totalPages: number;
  initialPage: number;
  goToPage: (initialPage: number) => void;
}
const Pagination = ({
  totalPages = 10,
  initialPage = 1,
  goToPage,
}: paginationProps) => {
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 10;
    let startPage = Math.max(
      1,
      initialPage - Math.floor(maxVisibleButtons / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            i === initialPage
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="flex items-center mb-4 sm:mb-0">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{initialPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => goToPage(1)}
          disabled={initialPage === 1}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to first page"
        >
          <FaAngleDoubleLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => goToPage(initialPage - 1)}
          disabled={initialPage === 1}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>
        {renderPageButtons()}
        <button
          onClick={() => goToPage(initialPage + 1)}
          disabled={initialPage === totalPages}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={initialPage === totalPages}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to last page"
        >
          <FaAngleDoubleRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
