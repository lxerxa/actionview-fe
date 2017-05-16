import React, { Component, PropTypes } from 'react';

class Error extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    let second = 3;
    this.timer = setInterval(
      () => {
        second -= 1;
        if (second < 0) {
          clearInterval(this.timer);
          this.timer = undefined;
          this.context.router.push({ pathname: '/myproject' });
        } else {
          document.getElementById('num').innerHTML = second;
        }
      }, 1000);
  }

  render() {
    return (
      <div style={ { paddingTop: '180px', textAlign: 'center', backgroundColor: '#ccc', height: '100%' } }>
         <h1>抱歉，您访问的页面不存在。</h1><br/>
         <h4>
           <font color='red' id='num'>3</font>
           <span>&nbsp;秒钟后，自动跳转到项目中心页面。</span>
        </h4>
      </div>
    );
  }
}
export default Error;
