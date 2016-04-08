import React, { Component } from 'react';

class Login extends Component {

  render() {
    const style = { marginTop: 13 + '%' };
    return (
      <div className='signin-box'>
        <div className='signin-container' style={ style }>
          <h4 className='title'>用户登录</h4>
          <form className='signin-form form-horizontal' noValidate>
            <div className='form-group'>
              <div className='input-group'>
                <div className='input-group-addon'>
                  <i className='fa fa-envelope-o'></i>
                </div>
                <input type='email'className='form-control ng-invalid' placeholder='邮箱' />
              </div>
            </div>
            <div className='form-group'>
              <div className='input-group'>
                <div className='input-group-addon'>
                  <i className='fa fa-unlock-alt'></i>
                </div>
                <input type='password' className='form-control ng-invalid' placeholder='密码'/>
              </div>
            </div>
            <div className='form-group'>
              <button className='btn btn-primary btn-lg btn-block' type='submit'>登 录</button>
            </div>
          </form>
          <p className='text-center'>还没有账户，马上注册</p>
        </div>
      </div>
    );
  }

}

export default Login;
