import React, { Component, PropTypes } from 'react';

const no_avatar = require('../../assets/images/no_avatar.png');

const { API_BASENAME } = process.env;

const bgColors = [
  '#815b3a',
  '#f79232',
  '#3b7fc4',
  '#654982',
  '#4a6785',
  '#8eb021',
  '#d39c3f',
  '#f15c75',
  '#ac707a'
];

export default class Avatar extends Component {
  constructor(props) {
    super(props);
    this.getBgColor = this.getBgColor.bind(this);
  }

  static propTypes = {
    size: PropTypes.string,
    circle: PropTypes.bool,
    data: PropTypes.object.isRequired
  }

  getBgColor() {
    const { data } = this.props;

    let t = 0;
    for (let c of data.id) {
      t += c.charCodeAt();
    }
    const m = t % 9;
    return bgColors[m];
  }

  render() {
    const { data={}, circle=false } = this.props;

    const brStyle = circle ? { borderRadius: '50%' } : { borderRadius: '4px' };

    if (data.avatar) {
      return (
        <div title={ data.name || '' }>
          <img src={ API_BASENAME + '/getavatar?fid=' + data.avatar } className='default-avatar' style={ brStyle }/> 
        </div>
      );
    }

    if (!data.id) {
      return (
        <div title={ data.name || '' }>
          <img src={ no_avatar } className='default-avatar' style={ brStyle }/> 
        </div>
      );
    }

    const style = { 
      backgroundColor: this.getBgColor(), 
      color: '#fff', 
      lineHeight: 2.3, 
      textAlign: 'center',
      fontSize: '12px',
      ...brStyle 
    };
    const displayName = (data.name || data.first_name).substr(0, 3).substr(-2);

    return (
      <div className='default-avatar' style={ style } title={ data.name || '' }>
        { displayName }
      </div>
    );
  }
}
