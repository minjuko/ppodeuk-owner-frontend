import Button from "../atoms/Button";

const Pagination = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-4 py-4"
      aria-label="목록 페이지 이동"
    >
      <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        이전
      </Button>
      <span aria-live="polite">
        {page} / {totalPages}
      </span>
      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        다음
      </Button>
    </nav>
  );
};

export default Pagination;
