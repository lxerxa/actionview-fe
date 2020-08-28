import React, { PropTypes, Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Label, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const SettingPwdModal = require('./SettingPwdModal');
const EnableNotify = require('./EnableNotify');
const img = require('../../assets/images/loading.gif');

const { API_BASENAME } = process.env;

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      mode: '',
      user: {},
      pwdModalShow: false, 
      enableNotifyShow: false };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    pkey: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired,
    handle: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  render() {
    const { 
      i18n, 
      pkey, 
      collection, 
      indexLoading, 
      itemLoading, 
      handle } = this.props;

    const statusStyles = { 
      unused: { style: 'danger', name: '未开通' }, 
      enabled: { style: 'success', name: '已启用' }, 
      disabled: { style: 'danger', name: '已禁用' } 
    };

    const users = {
      github: { key: 'github', name: 'GitHub' },
      gitlab: { key: 'gitlab', name: 'GitLab' }
    };

    const github = _.find(collection, { user: 'github' }) || {};
    const gitlab = _.find(collection, { user: 'gitlab' }) || {};

    const gitHubHeader = (
      <span style={ { fontWeight: 600 } }>
        GitHub 
      </span>
    );
    const gitLabHeader = (
      <span style={ { fontWeight: 600 } }>
        GitLab
      </span>
    );

    return (
      <div style={ { marginTop: '15px', marginBottom: '30px' } }>
        <div className='info-col' style={ { marginBottom: '15px' } }>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>
            <span>
              目前外部用户仅支持：GitHub、GitLab。
            </span>
            <span>
              <br/>
              <b>提交说明：</b>
              <br/>
              <span style={ { marginLeft: '15px' } }>触发事件请选择：Push Event;</span>
              <br/>
              <span style={ { marginLeft: '15px' } }>Git提交代码备注形式有两种：git commit -m 'xx-yy dddd' 和 git commit -m 'xx-yy-zz dddd'，后者可改变问题状态。</span>
              <br/>
              <span style={ { marginLeft: '15px' } }>其中，xx: 项目健值，yy: 问题编号， zz: 动作ID（流程预览图可查看），dddd: 描述文字。</span>
              <br/>
              <span style={ { marginLeft: '15px' } }>Push代码后，在问题of详细页面将会出现"Git提交"页签，可看到相应of提交记录，其中ActionView侧显示of操作用户是通过代码提交者ofEmail识别of。</span>
            </span>
          </div>
        </div>
        <Panel header={ gitHubHeader } style={ { textAlign: 'center' } }>
          <div>
            <b>Request Url:</b> { 'http://www.example.com' + API_BASENAME + '/webhook/github/project/' + pkey } { !indexLoading && <Label bsStyle={ statusStyles[github.status] && statusStyles[github.status].style || 'default' }>{ statusStyles[github.status] && statusStyles[github.status].name || '未开通' }</Label> }
          </div>
          { indexLoading || (itemLoading && this.state.user.key == 'github' && (this.state.mode == 'enable' || this.state.mode == 'disable')) ?
          <div style={ { marginTop: '10px' } }>
            <img src={ img } className='loading'/>
          </div>
          :
          <div style={ { marginTop: '10px' } }>
            { (!github.status || github.status === 'unused') && <Button bsStyle='primary' onClick={ () => { this.setState({ mode: 'use', user: users['github'], pwdModalShow: true }) } }>开通</Button> }
            { github.status === 'disabled' && <Button bsStyle='primary' onClick={ () => { this.setState({ mode: 'enable', user: users['github'], enableNotifyShow: true }) } }>enable</Button> }
            { github.status === 'enabled' && <Button bsStyle='link' onClick={ () => { this.setState({ mode: 'resetPwd', user: users['github'], pwdModalShow: true }) } }>重置密码</Button> }
            { github.status === 'enabled' && <Button bsStyle='link' onClick={ () => { this.setState({ mode: 'disable', user: users['github'], enableNotifyShow: true }) } }>disable</Button> }
          </div> }
        </Panel>
        <Panel header={ gitLabHeader } style={ { textAlign: 'center' } }>
          <div>
            <b>Request Url:</b> { 'http://www.example.com' + API_BASENAME + '/webhook/gitlab/project/' + pkey } { !indexLoading && <Label bsStyle={ statusStyles[gitlab.status] && statusStyles[gitlab.status].style || 'default' }>{ statusStyles[gitlab.status] && statusStyles[gitlab.status].name || '未开通' }</Label> }
          </div>
          { indexLoading || (itemLoading && this.state.user.key == 'gitlab' && (this.state.mode == 'enable' || this.state.mode == 'disable')) ?
          <div style={ { marginTop: '10px' } }>
            <img src={ img } className='loading'/>
          </div>
          :
          <div style={ { marginTop: '10px' } }>
            { (!gitlab.status || gitlab.status === 'unused') && <Button bsStyle='primary' onClick={ () => { this.setState({ mode: 'use', user: users['gitlab'], pwdModalShow: true }) } }>开通</Button> }
            { gitlab.status === 'disabled' && <Button bsStyle='primary' onClick={ () => { this.setState({ mode: 'enable', user: users['gitlab'], enableNotifyShow: true }) } }>enable</Button> }
            { gitlab.status === 'enabled' && <Button bsStyle='link' onClick={ () => { this.setState({ mode: 'resetPwd', user: users['gitlab'], pwdModalShow: true }) } }>重置密码</Button> }
            { gitlab.status === 'enabled' && <Button bsStyle='link' onClick={ () => { this.setState({ mode: 'disable', user: users['gitlab'], enableNotifyShow: true }) } }>disable</Button> }
          </div> }
        </Panel>
        { this.state.pwdModalShow &&
          <SettingPwdModal
            show
            close={ () => { this.setState({ pwdModalShow: false }) } }
            user={ this.state.user }
            mode={ this.state.mode }
            handle={ handle }
            i18n={ i18n }/> }
        { this.state.enableNotifyShow &&
          <EnableNotify
            show
            close={ () => { this.setState({ enableNotifyShow: false }) } }
            user={ this.state.user }
            mode={ this.state.mode }
            handle={ handle }/> }
      </div>
    );
  }
}
