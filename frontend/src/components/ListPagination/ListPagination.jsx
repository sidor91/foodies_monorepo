const getVisiblePages = (page, totalPages) => {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 2) {
    return [1, 2, 3];
  }

  if (page >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [page - 1, page, page + 1];
};

const ListPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className="flex justify-center" aria-label="Profile list pagination">
      <ul className="flex h-[4rem] items-start gap-[0.6rem] px-[0.6rem]">
        {visiblePages.map((pageNumber) => {
          const isActive = page === pageNumber;

          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={`
                  flex h-[4rem] w-[4rem] items-center justify-center
                  rounded-full
                  text-[1.4rem] leading-[2rem] font-normal
                  transition-colors duration-100
                  ${
                    isActive
                      ? "border border-accent text-accent"
                      : "border border-secondary text-primary hover:border-accent hover:text-accent"
                  }
                `}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
                disabled={isActive}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ListPagination;
