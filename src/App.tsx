import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <div className="px-3 py-2 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap">
              <a href="/" className="d-flex align-items-center me-auto">
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <ul className="nav">
                <li>
                  {/* todo text-secondary for selected */}
                  <a href="/" className="nav-link text-white"> 
                    Kits
                  </a>
                </li>
                <li>
                  <a href="/" className="nav-link text-white">
                    Upload
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <main>
        <h1>Welcome!</h1>
      </main>
    </div>
  );
}

export default App;
