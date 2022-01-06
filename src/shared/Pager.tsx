import React from 'react';

interface PagerProps {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	onChange: (page: number) => void;
}

export function Pager(props: PagerProps) {
	function previous() {
		let page = props.currentPage - 1;
		page = page <= 0 ? totalPages() : page;
		props.onChange(page);
	}

	function next() {
		let page = props.currentPage + 1;
		page = page > totalPages() ? 1 : page;
		props.onChange(page);
	}

	function totalPages() {
		return Math.ceil(props.totalCount / props.pageSize);
	}

	return (
		<div>
			<button
				type="button"
				className="btn btn-outline-dark"
				onClick={(e) => previous()}
				disabled={props.currentPage === 1}
			>
				<i className="bi bi-arrow-left"></i>
			</button>
			<span className="mx-1">
				{props.currentPage} / {totalPages()}
			</span>
			<button
				type="button"
				className="btn btn-outline-dark"
				onClick={(e) => next()}
				disabled={props.currentPage === totalPages()}
			>
				<i className="bi bi-arrow-right"></i>
			</button>
		</div>
	);
}

export default Pager;
