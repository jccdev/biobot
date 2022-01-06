import React, { useState } from 'react';
import Loading from '../shared/Loading';

export function Upload() {
	const [loading, setLoading] = useState(false);
	const [json, setJson] = useState<string>(null);
	const [error, setError] = useState<string>(null);
	const [uploaded, setUploaded] = useState(false);

	function readFile(file: File): Promise<void> {
		const reader = new FileReader();

		return new Promise<void>((resolve, reject) => {
			try {
				reader.onload = () => {
					try {
						let json = reader.result as string;
						setJson(json);
						setLoading(false);
						resolve();
					} catch (err) {
						reject(err);
					}
				};
				reader.readAsText(file);
			} catch (err) {
				reject(err);
			}
		});
	}

	async function processFile(event: React.ChangeEvent<HTMLInputElement>) {
		try {
			setUploaded(false);
			setLoading(true);
			setError(null);
			const file = event.target.files[0];
			await readFile(file);
		} catch (error) {
			setError(`Exception Occurred ${error.toString()}`);
		} finally {
			setLoading(false);
		}
	}

	function showError() {
		if (error) {
			return <div className="alert alert-danger my-2">{error}</div>;
		}
	}

	function showUpload() {
		if (json) {
			return (
				<div className="mt-2">
					<button
						className="btn btn-dark"
						onClick={(e) => upload()}
						type="button"
					>
						Upload
					</button>
					{uploaded && (
						<span className="text-success  mx-2">File is uploaded!</span>
					)}
				</div>
			);
		}
	}

	async function upload() {
		setLoading(true);
		setError(null);
		try {
			const url = `http://localhost:3001/kits/upload`;

			const response = await fetch(url, {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: json,
			});

			if (response.ok) {
				setUploaded(true);
			} else {
				throw Error(response?.statusText);
			}
		} catch (error) {
			setError(`Exception Occurred ${error.toString()}`);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container">
			<h1 className="mt-2">Upload Kits</h1>
			<div className="mt-3">
				<Loading loading={loading}>
					<input
						className="form-control"
						type="file"
						id="formFile"
						onChange={(e) => processFile(e)}
						accept="application/json,.json"
					/>
					{showError()}
					{showUpload()}
				</Loading>
			</div>
		</div>
	);
}

export default Upload;
