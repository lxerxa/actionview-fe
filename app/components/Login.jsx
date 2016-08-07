import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as SessionActions from 'redux/actions/SessionActions';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(values.email)) {
    errors.email = '无效电子邮件地址';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length > 30) {
    errors.password = '密码长度不超过30';
  }
  return errors;
};

function mapStateToProps(state) {
  return {
    session: state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SessionActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
  validate
})
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    session: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,
    fields: PropTypes.object,
    values: PropTypes.object
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { values, actions, dispatch } = this.props;
    await actions.create(values);

    const { session } = this.context.store.getState();
    if (session.ecode === 0 && typeof session.user._id !== 'undefined') {
      dispatch(push('/home'));
    }
  }

  render() {
    const { session, fields: { email, password }, dirty, invalid, submitting } = this.props;
    const style = { marginTop: 13 + '%' };

    return (
      <div className='signin-box'>
        <div className='signin-container' style={ style }>
          <h4 className='title'>{ session.ecode !== 0 ? '错误的邮箱或密码' : '用户登录' } </h4>
          <form className='signin-form form-horizontal' onSubmit={ this.handleSubmit }>
            <div className='form-group'>
              <div className='input-group'>
                <div className='input-group-addon'>
                  <i className='fa fa-envelope-o'></i>
                </div>
                <input type='email' className='form-control ng-invalid' placeholder='邮箱' {...email} />
              </div>
            </div>
            <div className='form-group'>
              <div className='input-group'>
                <div className='input-group-addon'>
                  <i className='fa fa-unlock-alt'></i>
                </div>
                <input type='password' className='form-control ng-invalid' placeholder='密码' {...password} />
              </div>
            </div>
            <div className='form-group'>
              <button disabled={ submitting || (dirty && invalid) } className='btn btn-primary btn-lg btn-block' type='submit'>登 录</button>
            </div>
          </form>
          <p className='text-center'>还没有账户，马上注册</p>
        </div>
      </div>
    );
  }
}

export default Login;
