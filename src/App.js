import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(async () => {
    const response = await fetch('http://localhost:3001/cpu-average');
    const average = await response.json();
    console.log('average', average);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
