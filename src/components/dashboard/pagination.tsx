import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export function DataTablePagination({
	pagination,
	setPagination,
}: {
	pagination: {
		currentPage: number;
		itemsPerPage: number;
		totalPages: number;
	};
	setPagination: (pagination: {
		currentPage: number;
		itemsPerPage: number;
		totalPages: number;
	}) => void;
}) {
	const { currentPage, totalPages } = pagination;

	const handlePageClick = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setPagination({ ...pagination, currentPage: page });
	};

	const renderPageNumbers = () => {
		const pages = [];

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= currentPage - 1 && i <= currentPage + 1)
			) {
				pages.push(
					<PaginationItem key={i}>
						<PaginationLink
							href="#"
							isActive={i === currentPage}
							onClick={(e) => {
								e.preventDefault();
								handlePageClick(i);
							}}
						>
							{i}
						</PaginationLink>
					</PaginationItem>,
				);
			} else if (i === currentPage - 2 || i === currentPage + 2) {
				pages.push(
					<PaginationItem key={`ellipsis-${i}`}>
						<PaginationEllipsis />
					</PaginationItem>,
				);
			}
		}

		return pages;
	};

	return (
		<Pagination className="mt-6">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageClick(currentPage - 1);
						}}
						aria-disabled={currentPage === 1}
					/>
				</PaginationItem>

				{renderPageNumbers()}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageClick(currentPage + 1);
						}}
						aria-disabled={currentPage === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
