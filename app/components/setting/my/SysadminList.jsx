import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, Nav, NavItem } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const no_avatar = require('../../../assets/images/no_avatar.png');
const img = require('../../../assets/images/loading.gif');
const ResetPwdModal = require('./ResetPwdModal');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { resetPwdModalShow: false };
    this.resetPwdModalClose = this.resetPwdModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    accounts: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    resetPwd: PropTypes.func.isRequired
  }

  resetPwdModalClose() {
    this.setState({ resetPwdModalShow: false });
  }

  componentWillMount() {
    const { getUser } = this.props;
    getUser();
  }

  render() {

    const styles = { marginLeft: '20px', marginTop: '10px', marginBottom: '10px' };
    const { i18n, accounts, resetPwd } = this.props;

    const accountItems = [];
    accountItems.push({
      id: 'avatar',
      title: (
        <div>
          <span className='table-td-title'>头像</span>
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
            <li>{ accounts.first_name || '-' }</li>
          </ul>
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

    return (
      <div>
        <Nav bsStyle='pills' style={ { marginTop: '10px', float: 'left', lineHeight: '1.0' } } activeKey='account'>
          <NavItem eventKey='account' href='#'>账号资料</NavItem>
        </Nav>
        <BootstrapTable data={ accountItems } bordered={ false } hover trClassName='tr-top'>
          <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
          <TableHeaderColumn width='260' dataField='title'/>
          <TableHeaderColumn width='200' dataField='contents'/>
          <TableHeaderColumn dataField='blank'/>
        </BootstrapTable>
        { this.state.resetPwdModalShow && 
          <ResetPwdModal 
            show 
            close={ this.resetPwdModalClose } 
            resetPwd={ resetPwd }
            i18n={ i18n } /> }
      </div>
    );
  }
}
