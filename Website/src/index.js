import React from 'react';
import ReactDom from 'react-dom';
import Pages from './Pages'
import './index.css';

function App() {
  return (
    <div className="col-333">
      <Pages />
    </div>
  )
}

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);