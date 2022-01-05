import React, { useRef, useEffect, useState, CSSProperties } from 'react';

const Loading: React.FunctionComponent<{ loading: boolean }> = (props) => {
	const container = useRef(null);
	const [overlay, setOverlay] = useState({ height: 75, width: 75 });

	const [observer] = useState(
		new ResizeObserver((entries) => {
			const entry = entries?.[0];
			if (entry) {
				setOverlay({
					height: entry.contentRect.height,
					width: entry.contentRect.width,
				});
			}
		}),
	);

	useEffect(() => {
		if (container.current && observer != null) {
			observer.observe(container.current);
		}
		return () => {
			observer.disconnect();
		};
	});

	function showOverlay() {
		if (props.loading) {
			const overlayStyle: CSSProperties = {
				zIndex: 2,
				position: 'absolute',
				top: 0,
				left: 0,
				width: overlay.width,
				height: overlay.height,
				backgroundColor: 'white',
				opacity: 0.75,
			};

			return (
				<div
					className="d-flex justify-content-center align-items-center"
					style={overlayStyle}
				>
					<span className="visually-hidden">Loading...</span>
					<div
						className="spinner-border text-dark"
						style={{ width: '60px', height: '60px' }}
					>
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			);
		}
	}

	return (
		<div
			ref={container}
			className="py-3"
			style={{ minHeight: '75px', position: 'relative' }}
		>
			{showOverlay()}
			<div style={{ zIndex: 1 }}>{props.children}</div>
		</div>
	);
};

export default Loading;
