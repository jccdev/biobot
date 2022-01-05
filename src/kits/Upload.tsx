import React from "react";

export function Upload() {
	return (
		<div className="container">
			<h1 className='mt-2'>Upload Kits</h1>
			<div className="mt-3">
				<input className="form-control" type="file" id="formFile" />
			</div>
		</div>
	)
}

export default Upload;