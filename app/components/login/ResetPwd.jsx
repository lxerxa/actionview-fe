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

  if (!values.new_password) {
    errors.new_password = '必填';
  }
  if (!values.new_password2) {
    errors.new_password2 = '必填';
  }
  if (values.new_password != values.new_password2) {
    errors.new_password2 = '密码不一致';
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
  form: 'resetpwd',
  fields: [ 'new_password', 'new_password2' ],
  validate
})
class ResetPwd extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, alertShow: false, emailShow: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    fields: PropTypes.object,
    values: PropTypes.object
  }

  async componentWillMount() {
    const { actions } = this.props;
    const { location: { query={} } } = this.props;
    await actions.resetpwdAccess(query && query.code || '');
    const { user } = this.props;
    if (user.ecode === 0) {
      this.setState({ emailShow: true, ecode: 0 });
    } else {
      this.setState({ alertShow: true, ecode: user.ecode });
    }
  }

  hideAlert() {
    this.setState({ alertShow: false });
  }

  async handleSubmit() {
    this.setState({ alertShow: false });

    const { values, actions, location: { query={} } } = this.props;
    await actions.resetpwd({ password: values.new_password, code: query.code });
    const { user } = this.props;
    if (user.ecode === 0) {
      this.setState({ emailShow: false, ecode: 0 });
    } else {
      this.setState({ alertShow: true, ecode: user.ecode });
    }
  }

  render() {
    const {  i18n: { errMsg }, fields: { new_password, new_password2 }, handleSubmit, invalid, submitting, user } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
          <div style={ { textAlign: 'center', marginTop: '15px', fontSize: '19px', marginBottom: '20px' } }>
            密码重置 
          </div>
          { this.state.emailShow ?
          <form onSubmit={ handleSubmit(this.handleSubmit) }>
            <FormGroup controlId='formControlsName'>
              <FormControl disabled type='type' value={ user.item && user.item.email || '' }/>
            </FormGroup>
            <FormGroup controlId='formControlsPwd' validationState={ new_password.touched && new_password.error ? 'error' : null }>
              <FormControl disabled={ submitting } type='password' { ...new_password } placeholder='新密码'/>
              { new_password.touched && new_password.error && <HelpBlock style={ { marginLeft: '5px' } }>{ new_password.error }</HelpBlock> }
            </FormGroup>
            <FormGroup controlId='formControlsPwd2' validationState={ new_password2.touched && new_password2.error ? 'error' : null }>
              <FormControl disabled={ submitting } type='password' { ...new_password2 } placeholder='确认密码'/>
              { new_password2.touched && new_password2.error && <HelpBlock style={ { marginLeft: '5px' } }>{ new_password2.error }</HelpBlock> }
            </FormGroup>
            <Button bsStyle='success' disabled={ invalid || submitting } type='submit'>{ submitting ? '重置中...' : '密码重置' }</Button>
          </form>
          :
          <div className='reset-pwd-msg'>
            { user.loading ?
            <img src={ img } className={ 'loading' }/>
            :
            <span>密码已重置，请重新 <Link to='/login'>登录</Link>。</span> }
          </div> }
          <div style={ { textAlign: 'center', marginBottom: '25px' } }>
            { this.state.alertShow && !submitting && errMsg[this.state.ecode] && <div style={ { marginTop: '10px', color: '#a94442' } }>抱歉，{ errMsg[this.state.ecode] }。</div> }
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPwd;
