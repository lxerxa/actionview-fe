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
  } else if (!/^(\w-*\.*)+@(\w+[\w|-]*)+(\.\w+[\w|-]*)*(\.\w{2,})+$/.test(values.email)) {
    errors.email = '输入格式有误';
  }
  return errors;
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch)
  };
}

@connect(({ i18n, user }) => ({ i18n, user }), mapDispatchToProps)
@reduxForm({
  form: 'forgot',
  fields: [ 'email' ],
  validate
})
class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, alertShow: false, emailShow: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
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

    const { values, actions } = this.props;
    await actions.resetpwdSendmail(values);
    const { user } = this.props;
    if (user.ecode === 0) {
      this.setState({ emailShow: false, ecode: 0 });
    } else {
      this.setState({ alertShow: true, ecode: user.ecode });
    }
  }

  render() {
    const {  i18n: { errMsg }, fields: { email }, handleSubmit, invalid, submitting, user } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
          <div style={ { textAlign: 'center', marginTop: '15px', fontSize: '19px', marginBottom: '20px' } }>
            找回密码 
          </div>
          { this.state.emailShow ?
          <form onSubmit={ handleSubmit(this.handleSubmit) }>
            <FormGroup controlId='formControlsText' validationState={ email.touched && email.error ? 'error' : null }>
              <FormControl disabled={ submitting } type='text' { ...email } placeholder='请输入用户邮箱'/>
              { email.touched && email.error && <HelpBlock style={ { marginLeft: '5px' } }>{ email.error }</HelpBlock> }
            </FormGroup>
            <Button bsStyle='success' disabled={ invalid || submitting } type='submit'>{ submitting ? '正在发送 ...' : '发送重置密码邮件' }</Button>
          </form>
          :
          <div className='reset-pwd-msg'>
            <span>重置密码链接已发送至邮箱 { user.item && user.item.sendto_email || '' }，有效期24小时。</span>
          </div> }
          <div style={ { textAlign: 'center', marginBottom: '30px' } }>
            { this.state.alertShow && !submitting && errMsg[this.state.ecode] && <div style={ { marginTop: '10px', color: '#a94442' } }>抱歉，{ errMsg[this.state.ecode] }。</div> }
          </div>
          <div style={ { textAlign: 'left', marginLeft: '5px', marginBottom: '25px' } }>
          1. 系统管理员请输入：admin@action.view，重置密码链接将发送至已配置的关联邮箱。
          <br/>
          2. 仅限本系统内部维护账号的密码找回，不支持外部同步账号。
          </div>
          <div className='login-footer'>
            <Link to='/login'>返回登录</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Forgot;
