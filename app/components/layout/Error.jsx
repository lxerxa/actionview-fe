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
          this.context.router.push({ pathname: '/login' });
        } else {
          document.getElementById('num').innerHTML = second;
        }
      }, 1000);
  }

  render() {
    return (
      <div style={ { paddingTop: '200px', textAlign: 'center', backgroundColor: '#ccc', height: '100%' } }>
         <h1>404</h1>
         <h3>
           抱歉，您访问of页面不存在。
         </h3><br/>
         <h4>
           <font color='red' id='num'>3</font>
           <span>&nbsp;秒钟后，自动跳转至登录页面。</span>
        </h4>
      </div>
    );
  }
}
export default Error;
