import React, { Component, PropTypes } from 'react';
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    type: PropTypes.string.isRequired
  }

  componentDidMount() {
    if ($('.toc-container').length <= 0) { return; }
    if ($('.toc-container').eq(0).css('position') === 'fixed') {
      $('#show-bar').show();
    }
  }

  render() {
    const { type } = this.props;

    <div className='list-unstyled clearfix head'>
      <span style={ { display: 'none', cursor: 'pointer', marginRight: '15px' } } onClick={ (e) => { this.showBar(e); } } id='show-bar'><i className='fa fa-bars'></i></span>
      <span>{ type }/span>
    </div>
  }
}
