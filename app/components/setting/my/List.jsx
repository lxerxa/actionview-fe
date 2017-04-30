import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, Nav, NavItem } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const no_avatar = require('../../../assets/images/no_avatar.png');
const img = require('../../../assets/images/loading.gif');
const EditModal = require('./EditModal');
const ResetPwdModal = require('./ResetPwdModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { tabKey: 'account', editModalShow: false, resetPwdModalShow: false, accounts: {}, favorites: {}, notifications: {} };
    this.editModalClose = this.editModalClose.bind(this);
    this.resetPwdModalClose = this.resetPwdModalClose.bind(this);
  }

  static propTypes = {
    getUser: PropTypes.func.isRequired,
    resetPwd: PropTypes.func.isRequired,
    updAccount: PropTypes.func.isRequired,
    updNotify: PropTypes.func.isRequired,
    updFavorite: PropTypes.func.isRequired,
    accountLoading: PropTypes.bool.isRequired,
    accounts: PropTypes.object.isRequired,
    notifyLoading: PropTypes.bool.isRequired,
    notifications: PropTypes.object.isRequired,
    favoriteLoading: PropTypes.bool.isRequired,
    favorites: PropTypes.object.isRequired
  }

  editModalClose() {
    this.setState({ editModalShow: false });
  }

  resetPwdModalClose() {
    this.setState({ resetPwdModalShow: false });
  }

  handleTabSelect(tabKey) {
    this.setState({ tabKey });
    if (tabKey == 'favorite') {
      notify.show('暂只支持中文，下个版本考虑支持多语言', 'warning', 2000);
    }
  }

  async notifyChange(values) {
    const { updNotify } = this.props;
    const ecode = await updNotify(values);
    if (ecode === 0) {
      notify.show('设置完成。', 'success', 2000);
    } else {
      const { notifications } = this.props;
      this.setState({ notifications });
      notify.show('设置失败。', 'error', 2000);
    }
    return ecode;
  }

  mailNotifyChange(newValues) {
    this.state.notifications.mail_notify = newValues.length > 0 && true; 
    this.setState({ notifications: this.state.notifications });
    this.notifyChange({ mail_notify: newValues.length > 0 });
  }

  mobileNotifyChange(newValues) {
    this.state.notifications.mobile_notify = newValues.length > 0 && true; 
    this.setState({ notifications: this.state.notifications });
    this.notifyChange({ mobile_notify: newValues.length > 0 });
  }

  dailyNotifyChange(newValues) {
    this.state.notifications.daily_notify = newValues.length > 0 && true; 
    this.setState({ notifications: this.state.notifications });
    this.notifyChange({ daily_notify: newValues.length > 0 });
  }

  weeklyNotifyChange(newValues) {
    this.state.notifications.weekly_notify = newValues.length > 0 && true; 
    this.setState({ notifications: this.state.notifications });
    this.notifyChange({ weekly_notify: newValues.length > 0 });
  }

  async languageChange(newValue) {
    _.extend(this.state.favorites, { language: newValue });
    this.setState({ favorites: this.state.favorites });
    const ecode = await this.favoriteChange({ language: newValue });
    if (ecode === 0) {
    //fix me
    }
  }

  async favoriteChange(values) {
    const { updFavorite } = this.props;
    const ecode = await updFavorite(values);
    if (ecode === 0) {
      alert('aa');
    } else {
      const { favorites } = this.props;
      alert('bb');
    }
    return ecode;
  }

  async componentWillMount() {
    const { getUser } = this.props;
    await getUser();

    const { accounts={}, notifications={}, favorites={} } = this.props;
    this.setState({ accounts, notifications, favorites });
  }

  render() {

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
 
    const startStyles = { color: '#54d09f', fontSize: '12px' };
    const closeStyles = { color: '#da4f4a', fontSize: '12px' };

    const { accounts, accountLoading, notifyLoading, favoriteLoading, updAccount, resetPwd } = this.props;
    const { notifications, favorites } = this.state;

    const accountItems = [];
    accountItems.push({
      id: 'avatar',
      title: (
        <div>
          <span className='table-td-title'>头像</span>
          <span className='table-td-issue-desc'>选择一张个人正面照片作为头像，让其他成员更容易认识你。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <img src={ no_avatar } className='big-no-avatar'/>
          <Button style={ { marginLeft: '15px' } } onClick={ () => { notify.show('暂不支持此功能。', 'warning', 2000); } }>设置头像</Button>
        </div>
      )
    });

    accountItems.push({
      id: 'basic',
      title: (
        <div>
          <span className='table-td-title'>个人资料</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>姓名：{ accounts.first_name || '-' }</li>
            <li>部门：{ accounts.department || '-' }</li>
            <li>职位：{ accounts.position || '-' }</li>
          </ul>
          <Button style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ editModalShow: true }) } }>编辑资料</Button>
        </div>
      )
    });

    accountItems.push({
      id: 'email',
      title: (
        <div>
          <span className='table-td-title'>邮箱地址</span>
          <span className='table-td-issue-desc'>该账号绑定的邮箱地址不能改变。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          当前邮箱地址为：{ accounts.email || '-' }
        </div>
      )
    });

    accountItems.push({
      id: 'password',
      title: (
        <div>
          <span className='table-td-title'>登录密码</span>
          <span className='table-td-issue-desc'>修改密码时需要输入当前密码；建议您定期更换密码，确保帐号安全。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <Button style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ resetPwdModalShow: true }) } }>修改密码</Button>
        </div>
      )
    });

    accountItems.push({
      id: 'phone',
      title: (
        <div>
          <span className='table-td-title'>绑定手机号</span>
          <span className='table-td-issue-desc'>修改手机时 ActionView 会发送短信到新的手机号，请按照短信中的验证码修改你的手机号码。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <div>当前手机号为：{ accounts.phone || '未设置' }</div>
          <div style={ { marginTop: '10px' } }>
            <Button style={ { marginLeft: '15px' } } onClick={ () => { notify.show('暂不支持此功能。', 'warning', 2000); } }>{ accounts.phone && '修改' }绑定手机号</Button>
          </div>
        </div>
      )
    });

    const favoriteItems = [];
    favoriteItems.push({
      id: 'language',
      title: (
        <div>
          <span className='table-td-title'>语言设置</span>
          <span className='table-td-issue-desc'>请选择您喜欢的语言</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <div style={ { margin: '3px' } }>中文</div>
        </div>
      )
    });

    const notificationItems = [];
    notificationItems.push({
      id: 'mail_notify',
      title: (
        <div>
          <span className='table-td-title'>邮件通知</span>
          <span className='table-td-issue-desc'>修改手机时 ActionView 会发送短信到新的手机号，请按照短信中的验证码修改你的手机号码。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <CheckboxGroup name='mail_notify' value={ notifications.mail_notify ? [ 'mail_notify' ] : [] } onChange={ this.mailNotifyChange.bind(this) }>
            <Checkbox disabled={ notifyLoading } value='mail_notify'/>
            <span> 开启邮件通知</span><br/>
            { notifications.mail_notify ?
            <span style={ startStyles }>已开启</span>
            :
            <span style={ closeStyles }>已关闭</span> }
          </CheckboxGroup>
        </div>
      )
    });

    notificationItems.push({
      id: 'mobile_notify',
      title: (
        <div>
          <span className='table-td-title'>移动端通知</span>
          <span className='table-td-issue-desc'>修改手机时 ActionView 会发送短信到新的手机号，请按照短信中的验证码修改你的手机号码。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <CheckboxGroup name='mobile_notify' value={ notifications.mobile_notify ? [ 'mobile_notify' ] : [] } onChange={ this.mobileNotifyChange.bind(this) }> 
            <Checkbox disabled={ notifyLoading } value='mobile_notify'/>
            <span> 开启移动端通知</span><br/>
            { notifications.mobile_notify ? 
            <span style={ startStyles }>已开启</span>
            :
            <span style={ closeStyles }>已关闭</span> }
          </CheckboxGroup>
        </div>
      )
    });

    notificationItems.push({
      id: 'daily_notify',
      title: (
        <div>
          <span className='table-td-title'>每日提醒</span>
          <span className='table-td-issue-desc'>每天向你发送一封包含当日工作内容的邮件。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <CheckboxGroup name='daily_notify' value={ notifications.daily_notify ? [ 'daily_notify' ] : [] } onChange={ this.dailyNotifyChange.bind(this) }>
            <Checkbox disabled={ notifyLoading } value='daily_notify'/>
            <span> 接收每日邮件提醒</span><br/>
            { notifications.daily_notify ?
            <span style={ startStyles }>已开启</span>
            :
            <span style={ closeStyles }>已关闭</span> }
          </CheckboxGroup>
        </div>
      )
    });

    notificationItems.push({
      id: 'weekly_notify',
      title: (
        <div>
          <span className='table-td-title'>每周提醒</span>
          <span className='table-td-issue-desc'>每周向你发送一封本周工作内容的邮件。</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <CheckboxGroup name='weekly_notify' value={ notifications.weekly_notify ? [ 'weekly_notify' ] : [] } onChange={ this.weeklyNotifyChange.bind(this) }>
            <Checkbox disabled={ notifyLoading } value='weekly_notify'/>
            <span> 接收每周邮件提醒</span><br/>
            { notifications.weekly_notify ? 
            <span style={ startStyles }>已开启</span>
            :
            <span style={ closeStyles }>已关闭</span> }
          </CheckboxGroup>
        </div>
      )
    });

    const records = [];

    let data = [];
    if (this.state.tabKey == 'account') {
      data = accountItems;
    } else if (this.state.tabKey == 'favorite') {
      data = favoriteItems;
    } else if (this.state.tabKey == 'notification') {
      data = notificationItems;
    } else if (this.state.tabKey == 'record') {
      data = records;
    }

    return (
      <div>
        <Nav bsStyle='pills' style={ { marginTop: '10px', float: 'left', lineHeight: '1.0' } } activeKey={ this.state.tabKey } onSelect={ this.handleTabSelect.bind(this) }>
          <NavItem eventKey='account' href='#'>账号资料</NavItem>
          <NavItem eventKey='favorite' href='#'>个人偏好</NavItem>
          <NavItem eventKey='notification' href='#'>消息提醒</NavItem>
          <NavItem eventKey='record' href='#'>登录日志</NavItem>
        </Nav>
        <BootstrapTable data={ data } bordered={ false } hover trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='260' dataField='title'/>
          <TableHeaderColumn width='200' dataField='contents'/>
          <TableHeaderColumn dataField='blank'/>
        </BootstrapTable>
        { this.state.editModalShow && <EditModal show close={ this.editModalClose } update={ updAccount } data={ accounts }/> }
        { this.state.resetPwdModalShow && <ResetPwdModal show close={ this.resetPwdModalClose } resetPwd={ resetPwd }/> }
      </div>
    );
  }
}
