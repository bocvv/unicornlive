/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-env browser */
import React, { Component } from 'react';
import './index.css';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { PlayerEventType } from 'amazon-ivs-player';


class Video extends Component {
  componentDidMount() {
    const { src, parentCallback } = this.props;
    window.registerIVSTech(videojs);
    this.player = videojs(this.videoNode, this.props);
    this.player.src(src);
    /* Location 13 */
    this.player.getIVSPlayer().addEventListener(PlayerEventType.TEXT_METADATA_CUE, (metadata) => {
      parentCallback(metadata.text);
      console.info(metadata.text);
    });

  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player className="video-container">
          <video ref={(node) => { this.videoNode = node; }} className="video-js" />
        </div>
      </div>
    );
  }
}

export default Video;