import React, { Component, PropTypes } from 'react';

const $ = require('$');

export default class BackTop extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.timer = null;
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  static propTypes = {
    visibilityHeight: PropTypes.number
  }

  componentDidMount() {
    const self = this;
    const { visibilityHeight=400 } = this.props;

    const container = $('.doc-container');
    container.unbind('scroll').scroll(function() {
      const oTop = container.scrollTop();
      self.setState({ visible: oTop > visibilityHeight });
    });
  }

  componentWillUnmount() {
    $('.doc-container').unbind('scroll');
  }

  scrollToTop() {
    const self = this;
    const container = $('.doc-container');

    cancelAnimationFrame(this.timer);
    this.timer = requestAnimationFrame(function fn() {
      const oTop = container.scrollTop();
      if(oTop > 0) {
        container.scrollTop(oTop - 50 > 0 ? oTop - 50 : 0);
        self.timer = requestAnimationFrame(fn);
      } else {
        cancelAnimationFrame(self.timer);
      }
    });
  }

  render() {
    const { visible=false } = this.state;

    return (
      <div
        id='backtop'
        className='back-top'
        style={ { visibility: visible && 'visible' || 'hidden' } }
        onClick={ this.scrollToTop }>
        <div className='back-top-content'>
          <div className='back-top-icon' />
        </div>
      </div>
    );
  }
}
