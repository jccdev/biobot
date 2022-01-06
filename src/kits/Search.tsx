import React, { useEffect, useState } from 'react';
import { Kit } from '../../api/src/shared-types/kit';
import { PagedResult } from '../../api/src/shared-types/pagedResult';
import Loading from '../shared/Loading';
import { Pager } from '../shared/Pager';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Search() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>(null);
	const [searchText, setSearchText] = useState('');
	const [results, setResults] = useState<PagedResult<Kit>>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		search(searchParams.get('search'), +searchParams.get('page'));
	}, [searchParams]);

	function updateSearchParams(searchText: string, page?: number) {
		let newSearchParams = new URLSearchParams();
		if (searchText) {
			newSearchParams.set('search', searchText);
		}
		if (page) {
			newSearchParams.set('page', page.toString());
		}

		setSearchParams(newSearchParams);
	}

	async function search(searchText: string, page?: number) {
		setLoading(true);
		setError(null);

		try {
			const url = `http://localhost:3001/kits?${searchParams.toString()}`;

			const response = await fetch(url);

			if (response.ok) {
				const result: PagedResult<Kit> = await response.json();
				setResults(result);
			} else {
				throw Error(response?.statusText);
			}
		} catch (error: any) {
			setError(`Server Exception Occurred: ${error?.toString()}`);
		} finally {
			setLoading(false);
		}
	}

	function searchChange(newSearch: string) {
		updateSearchParams(newSearch);
	}

	function pageChanged(page: number) {
		updateSearchParams(searchParams.get('search'), page);
	}

	function resultRows() {
		if (results?.data?.length) {
			return results.data.map((r) => (
				<tr key={r.id}>
					<th scope="row">{r.id}</th>
					<td>{r.label_id}</td>
					<td> {r.shipping_tracking_code}</td>
				</tr>
			));
		} else {
			return (
				<tr>
					<th scope="row" colSpan={3} className="text-center">
						No results found.
					</th>
				</tr>
			);
		}
	}

	function showError() {
		if (error) {
			return <div className="alert alert-danger my-2">{error}</div>;
		}
	}

	function pagination() {
		if (results?.data?.length) {
			return (
				<div className="d-flex justify-content-center">
					<Pager
						currentPage={results.page}
						pageSize={results.pageSize}
						totalCount={results.totalCount}
						onChange={(p) => pageChanged(p)}
					/>
				</div>
			);
		}
	}

	return (
		<div className="container">
			<h1 className="mt-2">Search Kits</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					searchChange(searchText);
				}}
			>
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						placeholder="Search"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					></input>
					<button className="btn btn-outline-secondary" type="submit">
						<i className="bi bi-search"></i>
					</button>
				</div>
			</form>

			<Loading loading={loading}>
				{showError()}
				<table className="table mt-3">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Label Id</th>
							<th scope="col">Shipping Tracking Code</th>
						</tr>
					</thead>
					<tbody>{resultRows()}</tbody>
				</table>
				{pagination()}
			</Loading>
		</div>
	);
}

export default Search;
