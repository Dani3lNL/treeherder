import React from 'react';
import PropTypes from 'prop-types';

// const getOffsetOfStep = function (order) {
//   const el = $('.lv-step[order="' + order + '"]');
//   const parentOffset = el.parent().offset();
//
//   return el.offset().top -
//          parentOffset.top + el.parent().scrollTop() -
//          parseInt($('.steps-data').first().css('padding-bottom'));
// };

export default class ErrorLines extends React.PureComponent {
  componentDidMount() {

  }

  render() {
    const { errors, setDisplayedStep } = this.props;

    return (
      // TODO need CSS hover highlight for lines
      <div>
        {errors.map(error => (<div
          key={error.line_number}
          onClick={() => setDisplayedStep(error.line_number)}
          className="text-left pull-left lv-error-line pointable"
        >
          <span className="badge badge-secondary lv-line-no text-left">
            {error.line_number + 1}
          </span>

          <span title={error.line}>{error.line}</span>
        </div>))}
      </div>
    );
  }
}

ErrorLines.propTypes = {
  errors: PropTypes.array.isRequired,
  setDisplayedStep: PropTypes.func.isRequired,
};
