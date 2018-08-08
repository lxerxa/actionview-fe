import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, Nav, NavItem } from 'react-bootstrap';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');
const PropertiesModal = require('./PropertiesModal');
const TimeTrackModal = require('./TimeTrackModal');
const SmtpServerModal = require('./SmtpServerModal');
const SetSendMailModal = require('./SetSendMailModal');
const ResetPwdModal = require('./ResetPwdModal');
const SendTestMailModal = require('./SendTestMailModal');
const ConfigActorModal = require('./ConfigActorModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tabKey: 'properties', 
      propertiesModalShow: false, 
      timeTrackModalShow: false, 
      smtpServerModalShow: false, 
      sendTestMailModalShow: false, 
      setSendMailShow: false,
      configActorModalShow: false };

    this.propertiesModalClose = this.propertiesModalClose.bind(this);
    this.timeTrackModalClose = this.timeTrackModalClose.bind(this);
    this.smtpServerModalClose = this.smtpServerModalClose.bind(this);
    this.sendTestMailModalClose = this.sendTestMailModalClose.bind(this);
    this.setSendMailModalClose = this.setSendMailModalClose.bind(this);
    this.configActorModalClose = this.configActorModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    settings: PropTypes.object.isRequired,
    show: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    resetPwd: PropTypes.func.isRequired,
    sendTestMail: PropTypes.func.isRequired
  }

  propertiesModalClose() {
    this.setState({ propertiesModalShow: false });
  }

  timeTrackModalClose() {
    this.setState({ timeTrackModalShow: false });
  }

  smtpServerModalClose() {
    this.setState({ smtpServerModalShow: false });
  }

  sendTestMailModalClose() {
    this.setState({ sendTestMailModalShow: false });
  }

  setSendMailModalClose() {
    this.setState({ setSendMailShow: false });
  }

  configActorModalClose() {
    this.setState({ configActorModalShow: false });
  }

  handleTabSelect(tabKey) {
    this.setState({ tabKey });
  }

  componentWillMount() {
    const { show } = this.props;
    show();
  }

  render() {
    const { i18n, update, resetPwd, sendTestMail, loading, settings: { properties={}, timetrack={}, mailserver={}, sysroles={} } } = this.props;

    const styles = { marginTop: '10px', marginBottom: '10px' };
 
    const propertyItems = [];
    propertyItems.push({
      id: 'mail_domain',
      title: (
        <div>
          <span className='table-td-title'>默认登录邮箱域名</span>
        </div>
      ),
      contents: (
        <div>
          { properties.login_mail_domain || '-' }
        </div>
      )
    });
    propertyItems.push({
      id: 'allow_create_project',
      title: (
        <div>
          <span className='table-td-title'>是否允许用户创建项目</span>
        </div>
      ),
      contents: (
        <div>
          { properties.allow_create_project === 1 ? '是' : '否' }
        </div>
      )
    });
    propertyItems.push({
      id: 'http_host',
      title: (
        <div>
          <span className='table-td-title'>系统域名</span>
          <span className='table-td-issue-desc'>发送邮件正文、通知消息内容中使用</span>
        </div>
      ),
      contents: (
        <div>
          { properties.http_host || '-' }
        </div>
      )
    });
    propertyItems.push({
      id: 'allowed_login_num',
      title: (
        <div>
          <span className='table-td-title'>启用安全登录保护</span>
          <span className='table-td-issue-desc'>如果开启此功能，一、防止DDoS攻击；二、同一用户或同一IP 15分钟内连续 5 次尝试登录没有成功，该用户或该IP将被锁定。</span>
        </div>
      ),
      contents: (
        <div>{ properties.enable_login_protection === 1 ? '是' : '否' }</div>
      )
    })
    propertyItems.push({
      id: 'default_locale',
      title: (
        <div>
          <span className='table-td-title'>默认语言</span>
          <span className='table-td-issue-desc'>不支持此功能配置</span>
        </div>
      ),
      contents: (
        <div>{ '中文' }</div>
      )
    });
    {/* propertyItems.push({
      id: 'default_timezone',
      title: (
        <div>
          <span className='table-td-title'>默认用户时区</span>
          <span className='table-td-issue-desc'>不支持此功能配置</span>
        </div>
      ),
      contents: (
        <div>{ '(GMT+08:00) 上海' }</div>
      )
    }); */}
    propertyItems.push({
      id: 'ip',
      title: (
        <div>
          <span className='table-td-title'>时间追踪</span>
          <span className='table-td-issue-desc'>建议启用此功能之前，确定此相关参数。若改动，可能会影响到原有问题的估算。</span>
        </div>
      ),
      contents: (
        <div>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>每周有效工作日：{ properties.week2day || '-' }</li>
            <li>每天有效工作时间：{ properties.day2hour || '-' }</li>
          </ul>
        </div>
      )
    });

    const timeTrackItems = [];
    timeTrackItems.push({
      id: 'week2day',
      title: (
        <div>
          <span className='table-td-title'>每周有效工作日</span>
        </div>
      ),
      contents: (
        <div>{ timetrack.week2day || 5 } 天</div>
      )
    });
    timeTrackItems.push({
      id: 'day2hour',
      title: (
        <div>
          <span className='table-td-title'>每天有效工作时间</span>
        </div>
      ),
      contents: (
        <div>{ timetrack.day2hour || 8 } 小时</div>
      )
    });

    const mailServerItems = [];
    mailServerItems.push({
      id: 'mail',
      title: (
        <div>
          <span className='table-td-title'>发送邮箱</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>发信地址：{ mailserver.send && mailserver.send.from || '-' }</li>
            <li>邮件前缀：{ mailserver.send && mailserver.send.prefix || '-' }</li>
          </ul>
          <Button disabled={ loading } style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ setSendMailShow: true }) } }>编辑邮箱</Button>
        </div>
      ) 
    });
    mailServerItems.push({
      id: 'smtp',
      title: (
        <div>
          <span className='table-td-title'>SMTP服务器</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>服务器：{ mailserver.smtp && mailserver.smtp.host || '-' }</li>
            <li>端口：{ mailserver.smtp && mailserver.smtp.port || '-' }</li>
            <li>加密：{ mailserver.smtp && mailserver.smtp.encryption || '无' }</li>
            <li>帐号：{ mailserver.smtp && mailserver.smtp.username || '-' }</li>
            <li>密码：{ mailserver.smtp && mailserver.smtp.password || '无' }</li>
          </ul>
          <Button disabled={ loading } style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ smtpServerModalShow: true }) } }>编辑服务器</Button>
        </div>
      )
    });

    const permissionItems = [];
    permissionItems.push({
      id: 'sysadmin',
      title: (
        <div>
          <span className='table-td-title'>系统管理员</span>
        </div>
      ),
      contents: (
        <div>
          <span>
          {/* _.map(sysroles.sys_admin || [], function(v){ return <div style={ { display: 'inline-block', float: 'left', margin: '3px' } }><Label style={ { color: '#007eff', border: '1px solid #c2e0ff', backgroundColor: '#ebf5ff', fontWeight: 'normal' } } key={ v.id }>{ v.name }</Label></div> }) */}
          { sysroles.sys_admin && sysroles.sys_admin.length > 0 ? _.map(sysroles.sys_admin || [], function(v, i){ if (i === 0) { return v.name } else { return ', ' + v.name } }) : '-' }
          </span>
        </div>
      )
    });

    let data = [];
    if (this.state.tabKey == 'properties') {
      data = propertyItems;
    } else if (this.state.tabKey == 'timetrack') {
      data = timeTrackItems;
    } else if (this.state.tabKey == 'mailserver') {
      data = mailServerItems;
    } else if (this.state.tabKey == 'sysroles') {
      data = permissionItems;
    }

    return (
      <div>
        <Nav bsStyle='pills' style={ { marginTop: '10px', float: 'left', lineHeight: '1.0' } } activeKey={ this.state.tabKey } onSelect={ this.handleTabSelect.bind(this) }>
          <NavItem eventKey='properties' href='#'>通用设置</NavItem>
          {/*<NavItem eventKey='timetrack' href='#'>时间追踪</NavItem>*/}
          <NavItem eventKey='mailserver' href='#'>邮件服务器</NavItem>
          <NavItem eventKey='sysroles' href='#'>系统角色</NavItem>
        </Nav>
        <BootstrapTable data={ data } bordered={ false } hover trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='260' dataField='title'/>
          <TableHeaderColumn width='200' dataField='contents'/>
          <TableHeaderColumn dataField='blank'/>
        </BootstrapTable>
        { this.state.tabKey == 'properties' &&
        <div style={ { width: '100%', marginTop: '20px' } }>
          <Button disabled={ loading } onClick={ () => { this.setState({ propertiesModalShow: true }) } }>修改设置</Button>
        </div> }
        { this.state.tabKey == 'mailserver' &&
        <div style={ { width: '100%', marginTop: '20px' } }>
          <Button disabled={ loading } onClick={ () => { this.setState({ sendTestMailModalShow: true }) } }>发送测试邮件</Button>
        </div> }
        { this.state.tabKey == 'sysroles' &&
        <div style={ { width: '100%', marginTop: '20px' } }>
          <Button disabled={ loading } onClick={ () => { this.setState({ configActorModalShow: true }) } }>角色配置</Button>
        </div> }
        { this.state.propertiesModalShow && 
        <PropertiesModal 
          show 
          close={ this.propertiesModalClose } 
          update={ update } 
          data={ properties } 
          i18n={ i18n }/> }
        { this.state.timeTrackModalShow && 
        <TimeTrackModal 
          show 
          close={ this.timeTrackModalClose } 
          update={ update } 
          data={ timetrack } 
          i18n={ i18n }/> }
        { this.state.smtpServerModalShow && 
        <SmtpServerModal 
          show 
          close={ this.smtpServerModalClose } 
          update={ update } 
          data={ mailserver.smtp || {} } 
          i18n={ i18n }/> }
        { this.state.setSendMailShow && 
        <SetSendMailModal 
          show 
          close={ this.setSendMailModalClose } 
          update={ update } 
          data={ mailserver.send || {} } 
          i18n={ i18n }/> }
        { this.state.sendTestMailModalShow && 
        <SendTestMailModal 
          show 
          close={ this.sendTestMailModalClose } 
          sendMail={ sendTestMail } 
          i18n={ i18n }/> }
        { this.state.configActorModalShow && 
        <ConfigActorModal 
          show 
          close={ this.configActorModalClose } 
          update={ update } 
          data={ sysroles } 
          i18n={ i18n }/> }
      </div>
    );
  }
}
