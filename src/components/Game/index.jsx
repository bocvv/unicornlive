import React, { Component } from 'react';
/* Location 8 */
import awsvideoconfig from '../../aws-video-exports';

/* Location 10 */
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { onCreateQuestion, onUpdateQuestion } from '../../graphql/subscriptions';

/* Location 15 */
import { createAnswer } from '../../graphql/mutations';

import Video from '../Video';
import Modal from '../Modal';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      drawInfo: {},
    };
  }

  componentDidMount() {
    this.listenForQuestions();
    this.listenForAnswers();
    this.setupClient();
  }

  setupClient = () => {
    Auth.currentSession()
      .then((data) => {
        API.graphql(
          graphqlOperation(createAnswer, { input: { gameID: '1', owner: data.idToken.payload['cognito:username'] } }),
        ).then(((res) => {
          console.log(res);
        })).catch((err) => {
          console.log('err: ', err);
      });
    });
  }

  listenForQuestions = () => {
    const self = this;
    /* Location 11 */
    API.graphql(
      graphqlOperation(onCreateQuestion),
    ).subscribe({
      next: (data) => {
        self.setState({
          drawInfo: data.value.data,
        });
      },
    });
  }

  listenForAnswers = () => {
    const self = this;
    /* Location 12 */
    API.graphql(
      graphqlOperation(onUpdateQuestion),
    ).subscribe({
      next: (data) => {
        self.setState({
          drawInfo: data.value.data,
          modalVisible: true,
        });
      },
    });
  }

  callbackFunction = (childData) => {
    /* Location 14 */
    const { drawInfo } = this.state;
    let questionId = '';
    if ('onCreateQuestion' in drawInfo) {
      questionId = drawInfo.onCreateQuestion.id;
    }
    if (childData === questionId) {
      this.setState({
        modalVisible: true,
      });
      setTimeout(() => {
        this.setState({
          modalVisible: false,
        });
      }, 10000);
    }
  }

  render() {
    /* Location 9 */
    // const url = '';
    const url = awsvideoconfig.awsOutputIVS;
    const { modalVisible, drawInfo } = this.state;
    return (
      <div className="game-container">
        <Video 
          controls
          techOrder={['AmazonIVS']}
          src={url}
          bigPlayButton={false}
          parentCallback={this.callbackFunction}
          autoplay
        />
        <Modal className={modalVisible ? 'show' : 'hidden'} drawInfo={drawInfo} />
      </div>
    );
  }
}

export default Game;
