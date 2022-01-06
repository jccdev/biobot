import React, { useEffect, useState } from 'react';
import { Kit } from '../../api/src/shared-types/kit';
import { PagedResult } from '../../api/src/shared-types/pagedResult';
import Loading from '../shared/Loading';
import { Pager } from '../shared/Pager';
import { useSearchParams } from 'react-router-dom';

function Search() {
	// state
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>(null);
	const [searchText, setSearchText] = useState('');
	const [selectedAutoItemIx, setSelectedAutoItemIx] = useState<number>(null);
	const [autoItems, setAutoItems] = useState<Kit[]>([]);
	const [results, setResults] = useState<PagedResult<Kit>>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	// effects
	useEffect(() => {
		async function search() {
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

		search();
	}, [searchParams]);

	useEffect(() => {
		async function fetchAutoComplete() {
			setError(null);

			try {
				if (searchText && searchText.trim().length > 0) {
					const query = new URLSearchParams({ search: searchText });
					const url = `http://localhost:3001/kits/autocomplete?${query.toString()}`;

					const response = await fetch(url);

					if (response.ok) {
						const result: Kit[] = await response.json();
						setAutoItems(result);
					} else {
						throw Error(response?.statusText);
					}
				} else {
					setAutoItems([]);
				}
			} catch (error: any) {
				if (error?.name !== 'AbortError') {
					setError(`Server Exception Occurred: ${error?.toString()}`);
				}
			}
		}
		fetchAutoComplete();
	}, [searchText]);

	useEffect(() => {
		const onClick = () => {
			resetAuto();
		};
		document.addEventListener('click', onClick);

		return () => {
			document.removeEventListener('click', onClick);
		};
	}, []);

	// logic functions
	function updateSearchParams(
		searchText: string,
		exact: boolean,
		page?: number,
	) {
		let newSearchParams = new URLSearchParams();

		if (searchText) {
			newSearchParams.set('search', searchText);
		}

		if (exact) {
			newSearchParams.set('exact', 'true');
		}

		if (page) {
			newSearchParams.set('page', page.toString());
		}

		setSearchParams(newSearchParams);
	}

	function searchChange(newSearch: string, exact = false) {
		updateSearchParams(newSearch, exact);
		resetAuto();
	}

	function pageChanged(page: number) {
		updateSearchParams(searchParams.get('search'), false, page);
		resetAuto();
	}

	function resetAuto() {
		setSelectedAutoItemIx(null);
		setAutoItems([]);
	}

	// ui functions
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

	function autoCompleteList() {
		if (autoItems?.length > 0) {
			const listItems: JSX.Element[] = autoItems.map((kit, ix) => {
				return (
					<li
						className={
							'list-group-item' + (selectedAutoItemIx === ix ? ' active' : '')
						}
						style={{ cursor: 'pointer' }}
						onMouseEnter={(e) => setSelectedAutoItemIx(ix)}
						onMouseLeave={(e) => setSelectedAutoItemIx(null)}
						onClick={(e) => autoItemSelected()}
						key={kit.id}
					>
						Id: {kit.id} | Label: {kit.label_id} | Tracking:{' '}
						{kit.shipping_tracking_code}
					</li>
				);
			});

			return (
				<ul
					className="list-group w-100"
					style={{
						position: 'absolute',
						top: '38px',
						zIndex: 2,
						fontSize: '.75em',
					}}
					// this will prevent the click from leaking to the document and prevent clearing autocomplete
					onClick={(e) => e.preventDefault()}
				>
					{listItems}
				</ul>
			);
		}
	}

	function autoItemSelected() {
		const value = autoItems[selectedAutoItemIx].id.toString();
		searchChange(value, true);
		setSearchText('');
		resetAuto();
	}

	function inputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			if (selectedAutoItemIx) {
				autoItemSelected();
			} else {
				searchChange(searchText);
				resetAuto();
			}
		} else if (event.key === 'ArrowDown') {
			if (autoItems?.length > 0) {
				// nothing selected yet set the first value or wrap around
				if (
					selectedAutoItemIx == null ||
					selectedAutoItemIx === autoItems.length - 1
				) {
					setSelectedAutoItemIx(0);
				} else {
					setSelectedAutoItemIx(selectedAutoItemIx + 1);
				}
			}
		} else if (event.key === 'ArrowUp') {
			if (autoItems?.length > 0) {
				// nothing selected yet set the last value or wrap around
				if (selectedAutoItemIx == null || selectedAutoItemIx === 0) {
					setSelectedAutoItemIx(autoItems.length - 1);
				} else {
					setSelectedAutoItemIx(selectedAutoItemIx - 1);
				}
			}
		} else if (selectedAutoItemIx != null) {
			// user typed need to reset
			setSelectedAutoItemIx(null);
		}
	}

	return (
		<div className="container">
			<h1 className="mt-2">Search Kits</h1>
			<div style={{ position: 'relative' }}>
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						placeholder="Search"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => inputKeyDown(e)}
					></input>
					<button
						className="btn btn-outline-secondary"
						type="submit"
						onClick={(e) => searchChange(searchText)}
					>
						<i className="bi bi-search"></i>
					</button>
				</div>
				{autoCompleteList()}
			</div>

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
