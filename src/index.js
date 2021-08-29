import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from './globalStyles';
import CpuMonitor from './components/CpuMonitor';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <CpuMonitor />
  </React.StrictMode>,
  document.getElementById('root')
);
