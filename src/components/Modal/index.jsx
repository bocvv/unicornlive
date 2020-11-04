/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* Location 17 */
import { API, graphqlOperation } from 'aws-amplify';
import { updateAnswer } from '../../graphql/mutations';

import './index.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      question: '',
      id: '',
      userAnswer: -1,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { drawInfo, className } = nextProps;
    if (className === 'hidden') {
      return {
        answers: [],
        question: '',
        id: '',
        userAnswer: -1,
      };
    }
    let newState = {};
    if ('onCreateQuestion' in drawInfo) {
      if (prevState.userAnswer !== -1) {
        return prevState;
      }
      newState = drawInfo.onCreateQuestion;
      newState.userAnswer = -1;
    } else if ('onUpdateQuestion' in drawInfo) {
      newState = drawInfo.onUpdateQuestion;
      newState.userAnswer = prevState.userAnswer;
    }
    return newState;
  }

  answerChosen = (index) => {
    const { id } = this.state;
    /* Location 18 */
    API.graphql(
      graphqlOperation(
        updateAnswer,
        {
          input: {
            id,
            answer: [index],
          },
        },
      ),
    ).then((res) => {
      console.log('successfully submitted answer: ', res);
    }).catch((err) => {
      console.log('err: ', err);
    });
    
    this.setState({
      userAnswer: index,
    });
  }

  drawAnswerButtons = (answers, userAnswer, answerId) => {
    const buttons = answers.map((answer, index) => {
      let className = 'answerButton';

      if (userAnswer === index) {
        className = className.concat(' selectedAnswer');
        if (answerId && answerId !== userAnswer) {
          className = className.concat(' wrongAnswer');
        }
      }

      if (answerId === index) {
        className = className.concat(' correctAnswer');
      }

      return (
        <li>
          <button
            disabled={answerId !== null}
            onClick={() => this.answerChosen(index)}
            className={className}
            type="button"
          >
            { answer }
          </button>
        </li>
      );
    });

    return (
      <ul>
        {buttons}
      </ul>
    );
  }

  render() {
    const {
      question, answers, answerId, userAnswer,
    } = this.state;
    const { className } = this.props;
    return (
      <div className={`modal-container ${className}`}>
        <div data-prevent-distortion>
          <div className="question-container">
            <div className="question">
              <div className="question-title-container">
                <div className="question-title">{ question }</div>
              </div>
              <div className="answers-container">
                <div className="answers">
                  {this.drawAnswerButtons(answers, userAnswer, answerId)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;

Modal.propTypes = {
  className: PropTypes.string.isRequired,
  drawInfo: PropTypes.shape({
    onCreateQuestion: PropTypes.object,
    onUpdateQuestion: PropTypes.object,
  }),
};
