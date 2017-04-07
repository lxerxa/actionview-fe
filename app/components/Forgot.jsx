import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

const img = require('../assets/images/loading.gif');
const $ = require('$');

import * as UserActions from 'redux/actions/UserActions';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = '账号不能为空';
  } else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(values.email) && !(/^1[34578]\d{9}$/.test(values.email))) {
    errors.email = '输入格式有误';
  }
  return errors;
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch)
  };
}

@connect(({ user }) => ({ user }), mapDispatchToProps)
@reduxForm({
  form: 'forgot',
  fields: [ 'email' ],
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
    location: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    fields: PropTypes.object,
    values: PropTypes.object
  }

  componentDidMount() {
    $('input[name=email]').attr('autocomplete', 'Off');

    const self = this;
    $('input[name=email]').bind('keypress', function() {
      self.hideAlert();
    });
  }

  hideAlert() {
    this.setState({ alertShow: false });
  }

  async handleSubmit() {
    const { values, actions } = this.props;
    const ecode = await actions.retrieve(values.email);
    if (ecode === 0) {
      this.setState({ alertShow: true });
    }
  }

  render() {
    const { session, fields: { email }, handleSubmit, invalid, submitting } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
          <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : '' }>
            <FormControl disabled={ submitting } type='text' { ...email } placeholder='邮箱/手机号'/>
            { email.touched && email.error && <HelpBlock style={ { marginLeft: '5px' } }>{ email.error }</HelpBlock> }
          </FormGroup>
          <Button bsStyle='success' disabled={ submitting } type='submit'>发送重置密码的邮件</Button>
          <div style={ { textAlign: 'center', height: '40px' } }>
            <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
            { this.state.alertShow && !submitting && <div style={ { marginTop: '10px', color: '#a94442' } }>抱歉，此邮箱未被注册。</div> }
          </div>
          <div className='login-footer'>
            <a href='#'>返回登录</a>
            <span className='split'/>
            <a href='#'>用户注册</a>
          </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Forgot;
