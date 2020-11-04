/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { Component } from 'react';
import './index.css';
import JsonTable from 'ts-react-json-table';
import Popup from 'react-popup';
/* Location 1 */
import { withAuthenticator } from 'aws-amplify-react';

/* Location 3 */
import { API, graphqlOperation } from 'aws-amplify';
import { createQuestion, updateQuestion } from '../../graphql/mutations';

import myJson from './questions.json';

const columns = [{
  key: 'Question',
  label: 'Questions:',
}, {
  key: 'button1',
  label: ' ',
  cell: () => <button type="button">Post Question</button>,
}, {
  key: 'button2',
  label: ' ',
  cell: () => <button type="button">Post Answer</button>,
}];

class Content extends Component {
  tableSettings = {
    header: false,
  }

  handleQuestionClick = (rowData) => {
    /* Location 4 */
    const question = {
      input: {
        question: rowData.Question,
        answers: rowData.Answers,
      },
    };
    API.graphql(graphqlOperation(createQuestion, question)).then((response) => {
      rowData.id = response.data.createQuestion.id;
      console.log(response.data.createQuestion);
    });
  }

  handleAnswerClick = (rowData) => {
    /* Location 5 */
    if (rowData.id != null) {
      const question = {
        input: {
          id: rowData.id,
          answerId: rowData.Answer,
        },
      };
      API.graphql(graphqlOperation(updateQuestion, question)).then((response) => {
        console.log(response.data.updateQuestion);
      });
    } else {
      console.log('Nothing');
      Popup.alert('Error: You have not submitted this question yet');
    }
  }

  onClickCell = (event, columnName, rowData) => {
    if (columnName === 'button1') {
      this.handleQuestionClick(rowData);
    } else if (columnName === 'button2') {
      this.handleAnswerClick(rowData);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Unicorn Live</h1>
        </header>
        <JsonTable rows={myJson.Questions} columns={columns} settings={this.tableSettings} onClickCell={this.onClickCell} className="tabelsa" />
      </div>
    );
  }
}

/* Location 2 */
export default withAuthenticator(Content);
// export default Content;
