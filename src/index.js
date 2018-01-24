import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import FlightSearch from './FlightSearch';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<FlightSearch />, document.getElementById('root'));
registerServiceWorker();
