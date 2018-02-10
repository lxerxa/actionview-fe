import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

const brand = require('../../assets/images/brand.png');
const $ = require('$');
const qs = require('qs');

import * as ProjectActions from 'redux/actions/ProjectActions';
import * as SessionActions from 'redux/actions/SessionActions';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = '账号不能为空';
  //} else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(values.email) && !(/^1[34578]\d{9}$/.test(values.email))) {
  //  errors.email = '输入格式有误';
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
    projectActions: bindActionCreators(ProjectActions, dispatch),
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
    location: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    fields: PropTypes.object,
    values: PropTypes.object
  }

  async componentWillMount() {
    const { actions, session, projectActions } = this.props;
    if (!session.invalid) {
      await actions.getSess();
      const { session } = this.props;
      if (session.ecode === 0 && session.user.id) {
        if (session.user.email === 'admin@action.view') {
          this.context.router.push({ pathname: '/admin/scheme/type' });
        } else {
          projectActions.cleanSelectedProject();
          if (session.user.latest_access_project) {
            this.context.router.push({ pathname: '/project/' + session.user.latest_access_project + '/summary' });
          } else {
            this.context.router.push({ pathname: '/myproject' });
          }
        }  
      }
    }
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
    this.setState({ alertShow: false });

    const { location: { query={} } } = this.props;
    const { values, actions, projectActions } = this.props;
    await actions.create(values);
    const { session } = this.props;
    if (session.ecode === 0 && session.user && session.user.id) {
      if (query.request_url) {
        let requests = decodeURI(query.request_url).split('?');
        let pathname = requests.shift();
        let query2 = {};
        if (requests.length > 0) {
          query2 = qs.parse(requests.shift());
        }
        this.context.router.push({ pathname, query: query2 });    
      } else {
        if (session.user.email === 'admin@action.view') {
          this.context.router.push({ pathname: '/admin/scheme/type' });
        } else {
          projectActions.cleanSelectedProject();
          if (session.user && session.user.latest_access_project) {
            this.context.router.push({ pathname: '/project/' + session.user.latest_access_project + '/summary' });    
          } else {
            this.context.router.push({ pathname: '/myproject' });    
          }
        }
      }
    } else {
      this.setState({ alertShow: true });
    }
  }

  render() {
    const { fields: { email, password }, handleSubmit, invalid, submitting, session } = this.props;

    return (
      <div className='login-panel'>
        <div className='login-form'>
          <div className='brand'>
            <img src={ brand } width={ 200 }/>
          </div>
          <form onSubmit={ handleSubmit(this.handleSubmit) }>
            <FormGroup controlId='formControlsName' validationState={ email.touched && email.error ? 'error' : '' }>
              <FormControl disabled={ submitting } type='text' { ...email } placeholder='用户名/邮箱'/>
              { email.touched && email.error && <HelpBlock style={ { marginLeft: '5px' } }>{ email.error }</HelpBlock> }
            </FormGroup>
            <FormGroup controlId='formControlsPwd' validationState={ password.touched && password.error ? 'error' : '' }>
              <FormControl disabled={ submitting } type='password' { ...password } placeholder='密码'/>
              { password.touched && password.error && <HelpBlock style={ { marginLeft: '5px' } }>{ password.error }</HelpBlock> }
            </FormGroup>
            <Button bsStyle='success' disabled={ submitting } type='submit'>{ submitting ? '登 录 中 ...' : '登 录' }</Button>
            <div style={ { textAlign: 'center', height: '40px' } }>
              { this.state.alertShow && !submitting && 
                <div style={ { marginTop: '10px', color: '#a94442' } }>
                  { session.ecode === -10000 && '登录失败，用户名或密码错误。' }   
                  { session.ecode === -10004 && session.emsg }   
                  { session.ecode === -10005 && '用户未激活。' }   
                  { session.ecode === -99999 && '系统错误。' }
                </div> }
            </div>
            <div className='login-footer'>
              <Link to='/forgot'>忘记密码</Link>
              <span className='split'/>
              <Link to='/register'>用户注册</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
