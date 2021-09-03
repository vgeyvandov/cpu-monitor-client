import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyle from './components/GlobalStyle';
import CpuMonitor from './components/CpuMonitor';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <CpuMonitor />
  </React.StrictMode>,
  document.getElementById('root')
);
