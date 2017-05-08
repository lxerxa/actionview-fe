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
      resetPwdModalShow: false,
      configActorModalShow: false };

    this.propertiesModalClose = this.propertiesModalClose.bind(this);
    this.timeTrackModalClose = this.timeTrackModalClose.bind(this);
    this.smtpServerModalClose = this.smtpServerModalClose.bind(this);
    this.sendTestMailModalClose = this.sendTestMailModalClose.bind(this);
    this.resetPwdModalClose = this.resetPwdModalClose.bind(this);
    this.configActorModalClose = this.configActorModalClose.bind(this);
  }

  static propTypes = {
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

  resetPwdModalClose() {
    this.setState({ resetPwdModalShow: false });
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
    const { update, resetPwd, sendTestMail, loading, settings: { properties={}, timetrack={}, smtp={}, sysroles={} } } = this.props;

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
      id: 'allowed_login_num',
      title: (
        <div>
          <span className='table-td-title'>最大尝试验证登录次数</span>
          <span className='table-td-issue-desc'>如果设置次数内没有登录成功，需输入验证码。（暂不支持此功能配置）</span>
        </div>
      ),
      contents: (
        <div>{ properties.allowed_login_num || '-' }</div>
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
    propertyItems.push({
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
    });
    propertyItems.push({
      id: 'ip',
      title: (
        <div>
          <span className='table-td-title'>时间追踪</span>
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
      id: 'ip',
      title: (
        <div>
          <span className='table-td-title'>SMTP服务器</span>
        </div>
      ),
      contents: (
        <div style={ styles }>
          <ul className='list-unstyled clearfix' style={ { lineHeight: 2.0 } }>
            <li>服务器：{ smtp.ip || '-' }</li>
            <li>端口：{ smtp.port || '-' }</li>
            <li>发件地址：{ smtp.send_addr || '-' }</li>
            <li>发送验证：{ smtp.send_auth === 1 ? '开启' : '关闭' }</li>
          </ul>
          <Button disabled={ loading } style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ smtpServerModalShow: true }) } }>编辑服务器</Button>
        </div>
      )
    });

    if (smtp.send_auth === 1) {
      mailServerItems.push({
        id: 'send_auth_pwd',
        title: (
          <div>
            <span className='table-td-title'>验证密码</span>
          </div>
        ),
        contents: (
          <div style={ styles }>
            <Button disabled={ loading } style={ { marginLeft: '15px' } } onClick={ () => { this.setState({ resetPwdModalShow: true }) } }>设置验证密码</Button>
          </div>
        )
      });
    }

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
        { this.state.propertiesModalShow && <PropertiesModal show close={ this.propertiesModalClose } update={ update } data={ properties }/> }
        { this.state.timeTrackModalShow && <TimeTrackModal show close={ this.timeTrackModalClose } update={ update } data={ timetrack }/> }
        { this.state.smtpServerModalShow && <SmtpServerModal show close={ this.smtpServerModalClose } update={ update } data={ smtp }/> }
        { this.state.resetPwdModalShow && <ResetPwdModal show close={ this.resetPwdModalClose } resetPwd={ resetPwd }/> }
        { this.state.sendTestMailModalShow && <SendTestMailModal show close={ this.sendTestMailModalClose } sendMail={ sendTestMail }/> }
        { this.state.configActorModalShow && <ConfigActorModal show close={ this.configActorModalClose } update={ update } data={ sysroles }/> }
      </div>
    );
  }
}
