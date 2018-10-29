import React from 'react';
import PropTypes from 'prop-types';

// Get the css class for the result, step buttons and other general use
const getShadingClass = result => 'result-status-shading-' + result;

export default class Navigation extends React.PureComponent {
  componentDidMount() {

  }

  render() {
    const { jobExists, result, jobError, rawLogUrl, reftestUrl } = this.props;
    const resultStatusShading = getShadingClass(result);

    return (
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <ul className="nav mr-auto navbar-row">
            <li>
              <span className="dropdown">
                <button
                  id="lv-logo"
                  title="Treeherder services"
                  data-toggle="dropdown"
                  className="dropdown-toggle"
                >Logviewer</button>
                <ul
                  className="dropdown-menu"
                  role="menu"
                  aria-labelledby="lv-logo"
                >
                  <li><a className="dropdown-item" href="/">Treeherder</a></li>
                  <li><a className="dropdown-item" href="perf.html">Perfherder</a></li>
                </ul>
              </span>
            </li>

            {jobExists ?
              <li className={resultStatusShading}>
                <div>
                  <span><strong>Result: </strong></span>
                  <span>{result}</span>
                </div>
              </li> :
              <li className="alert-danger">
                <div>
                  <span
                    title="The job does not exist or has expired"
                  >Unavailable: {jobError}</span>
                </div>
              </li>}

            <li>
              <a
                title="Open the raw log in a new window"
                target="_blank"
                rel="noopener noreferrer"
                href={rawLogUrl}
              >
                <span className="fa fa-file-text-o actionbtn-icon" />
                <span>open raw log</span>
              </a>
            </li>

            {!!reftestUrl && <li>
              <a
                title="Open the Reftest Analyser in a new window"
                target="_blank"
                rel="noopener noreferrer"
                href={reftestUrl}
              >
                <span className="fa fa-bar-chart-o actionbtn-icon" />
                <span>open analyser</span>
              </a>
            </li>}
          </ul>
        </div>
      </nav>

    );
  }
}

Navigation.propTypes = {
  jobExists: PropTypes.bool.isRequired,
  result: PropTypes.string.isRequired,
  jobError: PropTypes.string.isRequired,
  rawLogUrl: PropTypes.string.isRequired,
  reftestUrl: PropTypes.string,
};

Navigation.defaultProps = {
  reftestUrl: null,
};
