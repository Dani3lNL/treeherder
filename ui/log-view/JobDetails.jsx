import React from 'react';
import PropTypes from 'prop-types';
import { getInspectTaskUrl, getJobsUrl } from '../helpers/url';

export default class JobDetails extends React.PureComponent {
  componentDidMount() {

  }

  render() {
    const { logProperties, jobDetails, jobId, taskId } = this.props;

    return (
      <div className="job-header">
        <table className="table table-sm">
          {logProperties.map(property => (<tr>
            <th>{property.label}</th>
            {property.label === 'Revision' ?
              <td ng-if="property.label == 'Revision'" className="break-word">
                <a
                  href={getJobsUrl({ revision: property.value, selectedJob: jobId })}
                  title="Open push"
                >{property.value}</a>
              </td> :
              <td className="break-word">{property.value}</td>
            }
          </tr>))}
          {!!taskId && <tr>
            <th>
              Task
            </th>
            <td>
              <a href={getInspectTaskUrl(taskId)}>{taskId}</a>
            </td>
          </tr>}
          {jobDetails.map(line => (<tr>
            <th>
              <span>{line.title}: </span>
            </th>
            <td>
              {line.url ?
                <a
                  title={line.value}
                  href={line.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >{line.value}</a> :
                <span>{line.value}</span>
              }
            </td>
          </tr>))}
        </table>
      </div>
    );
  }
}

JobDetails.propTypes = {
  logProperties: PropTypes.array.isRequired,
  jobDetails: PropTypes.array.isRequired,
  jobId: PropTypes.string.isRequired,
  taskId: PropTypes.string,
};

JobDetails.defaultProps = {
  taskId: null,
};
