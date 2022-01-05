import React from 'react';
import logo from './logo.svg';
import './App.css';
import Search from './kits/Search';
import { Routes, Route, NavLink } from 'react-router-dom';
import Upload from './kits/Upload';

function App() {
	return (
		<div>
			<header>
				<div className="px-3 py-2 bg-dark text-white">
					<div className="container">
						<div className="d-flex flex-wrap">
							<a href="/" className="d-flex align-items-center me-auto">
								<img src={logo} className="App-logo" alt="logo" />
							</a>
							<ul className="nav">
								<li>
									<NavLink
										to="/"
										className={(active) =>
											active ? 'nav-link text-secondary' : 'nav-link text-white'
										}
										end
									>
										Search Kits
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/upload"
										className={(active) =>
											active ? 'nav-link text-secondary' : 'nav-link text-white'
										}
									>
										Upload
									</NavLink>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</header>
			<main>
				<Routes>
					<Route path="/" element={<Search />} />
					<Route path="/upload" element={<Upload />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
