import React from 'react';
import { LazyLog } from 'react-lazylog';

import Navigation from './Navigation';
import ErrorLines from './ErrorLines';
import {
  getAllUrlParams,
  getUrlParam,
  setUrlParam,
} from '../helpers/location';
import JobModel from '../models/job';
import { isReftest } from '../helpers/job';
import { getReftestUrl } from '../helpers/url';
import PushModel from '../models/push';
import JobDetailModel from '../models/jobDetail';
import JobInfo from '../shared/JobInfo';
import TextLogStepModel from '../models/textLogStep';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      rawLogUrl: '',
      resultStatusShading: '',
      logProperties: '',
      isTaskClusterLog: '',
      taskId: '',
      reftestUrl: '',
      jobExists: true,
      jobError: '',
      revision: null,
      errors: [],
      lineNumber: null,
    };

    this.setDisplayedStep = this.setDisplayedStep.bind(this);

    const queryString = getAllUrlParams();
    this.css = '';
    this.logOffset = 7;
    this.repoName = queryString.get('repo');
    this.jobId = queryString.get('job_id');
  }

  componentDidMount() {
    JobModel.get(this.repoName, this.jobId).then(async (job) => {
      // set the title of the browser window/tab
      const logViewerTitle = job.getTitle();
      document.title = logViewerTitle;
      // console.log('job', job);
      const rawLogUrl = job.logs && job.logs.length ? job.logs[0].url : null;
      // other properties, in order of appearance
      // Test to disable successful steps checkbox on taskcluster jobs
      const taskId = job.taskcluster_metadata ? job.taskcluster_metadata.task_id : null;
      // Test to expose the reftest button in the logviewer actionbar
      const reftestUrl = rawLogUrl && job.job_group_name && isReftest(job) ? getReftestUrl(rawLogUrl) : null;
      const jobDetails = await JobDetailModel.getJobDetails({ job_id: this.jobId });

      this.setState({
        job,
        rawLogUrl,
        taskId,
        reftestUrl,
        jobDetails,
        jobExists: true,
      }, async () => {
        // get the revision and linkify it
        PushModel.get(job.push_id).then(async (resp) => {
          const push = await resp.json();
          const revision = push.revision;

          this.setState({ revision });
        });
      });
    }).catch((error) => {
      this.setState({
        loading: false,
        jobExists: false,
        jobError: error.toString(),
      });
    });

    TextLogStepModel.get(this.jobId).then((textLogSteps) => {
      // console.log('steps', textLogSteps);
      // let shouldPost = true;
      const errors = textLogSteps.length ? textLogSteps[0].errors : [];
      const lineNumber = getUrlParam('lineNumber') || errors.length ? errors[0].line_number + 1 : null;

      this.setState({ lineNumber, errors });
    });
  }

  setDisplayedStep(lineNumber) {
    this.updateQuery({ lineNumber });
  }

  updateQuery(values) {
    const data = typeof values === 'string' ? JSON.parse(values) : values;
    const { lineNumber, highlightStart, highlightEnd } = data;

    if (highlightStart !== highlightEnd) {
      setUrlParam('lineNumber', `${highlightStart}-${highlightEnd}`, '');
    } else if (highlightStart) {
      setUrlParam('lineNumber', highlightStart, '');
    } else {
      setUrlParam('lineNumber', lineNumber, '');
    }
  }

  // setLogListener() {
  //   let workerReady = false;
  //
  //   $window.addEventListener('message', (e) => {
  //     // Send initial css when child frame loads URL successfully
  //     if (!workerReady) {
  //       workerReady = true;
  //
  //       $scope.css += logCss();
  //       $scope.logPostMessage({ customStyle: $scope.css });
  //     }
  //
  //     $timeout(updateQuery(e.data));
  //   });
  // }
  //
  // logPostMessage(values) {
  //   const { lineNumber, highlightStart } = values;
  //
  //   if (lineNumber && !highlightStart) {
  //     values.highlightStart = lineNumber;
  //     values.highlightEnd = lineNumber;
  //   }
  //
  //   updateQuery(values);
  //
  //   // Add offset to lineNumber to see above the failure line
  //   if (lineNumber) {
  //     values.lineNumber -= $rootScope.logOffset;
  //   }
  //
  //   $document[0].getElementById('logview').contentWindow.postMessage(values, '*');
  // }


  render() {
    const {
      job, rawLogUrl, reftestUrl, jobDetails, jobError, jobExists,
      revision, errors, lineNumber,
    } = this.state;
    console.log('jobDetails', jobDetails);

    return (
      <div className="body-logviewer h-100">
        <Navigation
          jobExists={jobExists}
          result={job ? job.result : ''}
          jobError={jobError}
          rawLogUrl={rawLogUrl}
          reftestUrl={reftestUrl}
        />
        {job && <div className="d-flex flex-column container-fluid h-100">
          <div className="run-data">
            <div className="row">
              <div className="col">
                <JobInfo
                  job={job}
                  jobDetails={jobDetails}
                  revision={revision}
                  className="list-unstyled"
                />
              </div>
              <div className="col">
                <ErrorLines
                  errors={errors}
                  setDisplayedStep={this.setDisplayedStep}
                />
              </div>
            </div>
          </div>
          <div className="logview-container h-100">
            <LazyLog url={rawLogUrl} stream lineNumber={lineNumber} />
          </div>
        </div>}
      </div>
    );
  }
}
