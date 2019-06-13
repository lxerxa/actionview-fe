import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { notify } from 'react-notify-toast';

const brand = require('../../assets/images/brand.png');
const img = require('../../assets/images/loading.gif');
const $ = require('$');

import * as UserActions from 'redux/actions/UserActions';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = '邮箱不能为空';
  } else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(values.email)) {
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
class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = { alertShow: false, emailShow: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  static propTypes = {
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
    this.setState({ alertShow: false });

    notify.show('试用版暂不支持此功能。', 'warning', 2000);
    return;

    const { values, actions, user } = this.props;
    await actions.resetpwd(values.email);
    if (user.ecode === 0) {
      this.setState({ emailShow: false });
    } else {
      this.setState({ alertShow: true });
    }
  }

  render() {
    const { fields: { email }, handleSubmit, invalid, submitting } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
          <div className='brand'>
            <img src={ brand } width={ 200 }/>
          </div>
          { this.state.emailShow ?
          <form onSubmit={ handleSubmit(this.handleSubmit) }>
            <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : null }>
              <FormControl disabled={ submitting } type='text' { ...email } placeholder='邮箱'/>
              { email.touched && email.error && <HelpBlock style={ { marginLeft: '5px' } }>{ email.error }</HelpBlock> }
            </FormGroup>
            <Button bsStyle='success' disabled={ invalid || submitting } type='submit'>发送重置密码的邮件</Button>
          </form>
          :
          <div className='reset-pwd-msg'>
            <span>重置密码链接已发送至邮箱。</span>
          </div> }
          <div style={ { textAlign: 'center', height: '40px' } }>
            <img src={ img } className={ submitting ? 'loading' : 'hide' }/>
            { this.state.alertShow && !submitting && <div style={ { marginTop: '10px', color: '#a94442' } }>抱歉，此邮箱未被注册。</div> }
          </div>
          <div className='login-footer'>
            <Link to='/login'>返回登录</Link>
            <span className='split'/>
            <Link to='/register'>用户注册</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Forgot;
