import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

const img = require('../assets/images/loading.gif');
const $ = require('$');

import * as SessionActions from 'redux/actions/SessionActions';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = '账号不能为空';
  } else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(values.email) && !(/^1[34578]\d{9}$/.test(values.email))) {
    errors.email = '输入格式有误';
  }

  if (!values.password) {
    errors.password = '密码不能为空';
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
  form: 'login',
  fields: ['email', 'password'],
  validate
})
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { alertShow: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    session: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    fields: PropTypes.object,
    values: PropTypes.object
  }

  componentDidMount() {
    $('input[name=email]').attr('autocomplete', 'Off');
    $('input[name=password]').attr('autocomplete', 'Off');

    const self = this;
    $('input[name=email]').bind('keypress', function() {
      self.hideAlert();
    });
    $('input[name=password]').bind('keypress', function() {
      self.hideAlert();
    });
  }

  hideAlert() {
    this.setState({ alertShow: false });
  }

  async handleSubmit() {
    const { values, actions } = this.props;
    await actions.create(values);
    const { session } = this.props;
    if (session.ecode === 0) {
      this.context.router.push({ pathname: '/myproject' });    
    } else {
      this.setState({ alertShow: true });
    }
  }

  render() {
    const { session, fields: { email, password }, handleSubmit, invalid, submitting } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
          <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : '' }>
            <FormControl disabled={ submitting } type='text' { ...email } placeholder='邮箱/手机号'/>
            { email.touched && email.error && <HelpBlock style={ { marginLeft: '5px' } }>{ email.error }</HelpBlock> }
          </FormGroup>
          <FormGroup controlId='formControlsText' validationState={ password.touched && password.error ? 'error' : '' }>
            <FormControl disabled={ submitting } type='password' { ...password } placeholder='密码'/>
            { password.touched && password.error && <HelpBlock style={ { marginLeft: '5px' } }>{ password.error }</HelpBlock> }
          </FormGroup>
          <Button bsStyle='success' disabled={ submitting } type='submit'>登  录</Button>
          <div style={ { textAlign: 'center', height: '40px' } }>
            <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
            { this.state.alertShow && !submitting && <div style={ { marginTop: '10px', color: '#a94442' } }>登录失败，用户名或密码错误。</div> }
          </div>
          <div className='login-footer'>
            <a href='#'>忘记密码</a>
            <span className='split'/>
            <a href='#'>用户注册</a>
          </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
