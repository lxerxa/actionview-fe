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

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { tabKey: 'properties', propertiesModalShow: false, timeTrackModalShow: false };
    this.propertiesModalClose = this.propertiesModalClose.bind(this);
    this.timeTrackModalClose = this.timeTrackModalClose.bind(this);
  }

  static propTypes = {
    settings: PropTypes.object.isRequired,
    show: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  propertiesModalClose() {
    this.setState({ propertiesModalShow: false });
  }

  timeTrackModalClose() {
    this.setState({ timeTrackModalShow: false });
  }

  handleTabSelect(tabKey) {
    this.setState({ tabKey });
  }

  editSetting() {
    if (this.state.tabKey === 'properties') {
      this.setState({ propertiesModalShow: true });
    } else if (this.state.tabKey === 'timetrack') {
      this.setState({ timeTrackModalShow: true });
    }
  }

  async componentWillMount() {
  }

  render() {
    const { update, settings } = this.props;

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
 
    const properties = [];
    properties.push({
      id: 'mail_domain',
      title: (
        <div>
          <span className='table-td-title'>默认登录邮箱域名</span>
        </div>
      ),
      contents: (
        <div>
          chinamobile.com
        </div>
      )
    });
    properties.push({
      id: 'allowed_login_num',
      title: (
        <div>
          <span className='table-td-title'>最大尝试验证登录次数</span>
          <span className='table-td-issue-desc'>如果设置次数内没有登录成功，需输入验证码。（暂不支持此功能）</span>
        </div>
      ),
      contents: (
        <div>3</div>
      )
    });

    const timeTrack = [];
    timeTrack.push({
      id: 'week2day',
      title: (
        <div>
          <span className='table-td-title'>每周有效工作日</span>
        </div>
      ),
      contents: (
        <div>5 天</div>
      )
    });
    timeTrack.push({
      id: 'day2hour',
      title: (
        <div>
          <span className='table-td-title'>每天有效工作时间</span>
        </div>
      ),
      contents: (
        <div>8 小时</div>
      )
    });

    const mailServer = [];
    mailServer.push({
      id: 'ip',
      title: (
        <div>
          <span className='table-td-title'>SMTP服务器IP</span>
        </div>
      ),
      contents: (
        <div>10.2.5.91</div>
      )
    });
    mailServer.push({
      id: 'port',
      title: (
        <div>
          <span className='table-td-title'>端口</span>
        </div>
      ),
      contents: (
        <div>25</div>
      )
    });
    mailServer.push({
      id: 'account',
      title: (
        <div>
          <span className='table-td-title'>帐号</span>
        </div>
      ),
      contents: (
        <div>actionview@chinamobile.com</div>
      )
    });
    mailServer.push({
      id: 'password',
      title: (
        <div>
          <span className='table-td-title'>密码</span>
        </div>
      ),
      contents: (
        <div>******</div>
      )
    });

    const permissions = [];
    permissions.push({
      id: 'sysadmin',
      title: (
        <div>
          <span className='table-td-title'>系统管理员</span>
        </div>
      ),
      contents: (
        <div>******</div>
      )
    });

    let data = [];
    if (this.state.tabKey == 'properties') {
      data = properties;
    } else if (this.state.tabKey == 'timetrack') {
      data = timeTrack;
    } else if (this.state.tabKey == 'mailserver') {
      data = mailServer;
    } else if (this.state.tabKey == 'permissions') {
      data = permissions;
    }

    return (
      <div>
        <Nav bsStyle='pills' style={ { marginTop: '10px', float: 'left', lineHeight: '1.0' } } activeKey={ this.state.tabKey } onSelect={ this.handleTabSelect.bind(this) }>
          <NavItem eventKey='properties' href='#'>通用设置</NavItem>
          <NavItem eventKey='timetrack' href='#'>时间追踪</NavItem>
          <NavItem eventKey='mailserver' href='#'>邮件服务器</NavItem>
          <NavItem eventKey='permissions' href='#'>全局权限</NavItem>
        </Nav>
        <BootstrapTable data={ data } bordered={ false } hover trClassName='tr-middle'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='260' dataField='title'/>
          <TableHeaderColumn width='200' dataField='contents'/>
          <TableHeaderColumn dataField='blank'/>
        </BootstrapTable>
        <div style={ { width: '100%', marginTop: '20px' } }>
          <Button onClick={ this.editSetting.bind(this) }>修改设置</Button>
        </div>
        { this.state.propertiesModalShow && <PropertiesModal show close={ this.propertiesModalClose } update={ update } data={ settings.properties || {} }/> }
        { this.state.timeTrackModalShow && <TimeTrackModal show close={ this.timeTrackModalClose } update={ update } data={ settings.timetrack || {} }/> }
      </div>
    );
  }
}
