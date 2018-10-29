import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Vendor Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';

// Vendor JS
import 'bootstrap';

// Treeherder Styles
import '../css/treeherder-global.css';
import './logviewer.css';

import App from './App';

const load = () => render((
  <AppContainer>
    <App />
  </AppContainer>
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', load);
}

load();
