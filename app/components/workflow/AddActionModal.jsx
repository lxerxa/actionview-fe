import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import Tabs, { TabPane } from 'rc-tabs';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

@reduxForm({
  form: 'wfconfig',
  fields: [ 'src_step', 'name', 'dest_step', 'screen', 'relation', 'stateParam', 'permissionParam', 'roleParam', 'setResolution', 'setState', 'assignIssue', 'addComments', 'updateHistory', 'triggerWebhook' ],
  validate
})
export default class AddActionModal extends Component {
  constructor(props) {
    super(props);
    this.state = { activeKey: '1', conditions: [], postFunctions: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    options: PropTypes.object,
    stepData: PropTypes.object,
    steps: PropTypes.array,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  handleSubmit() {
    const { values, create, close } = this.props;
    create(values);
    close();
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    close();
  }

  onTabClick(key) {
    if (key === this.state.activeKey) 
    {
      this.setState({ activeKey: '' });
    }
  }

  onTabChange(activeKey) {
    this.setState({ activeKey });
  }

  conditionsChanged(newConditions) {
    this.setState({
      conditions: newConditions
    });
  }

  postFunctionsChanged(newFunctions) {
    this.setState({
      postFunctions: newFunctions
    });
  }

  render() {
    const { fields: { src_step, name, dest_step, screen, relation, stateParam, permissionParam, roleParam, resolutionParam, assigneeParam }, options, steps, stepData, handleSubmit, invalid, submitting } = this.props;
    const stepOptions = _.map(steps, (val) => { return { label: val.name, value: val.id } });
    stepOptions.splice(_.findIndex(steps, { id: stepData.id }), 1);

    const screenOptions = _.map(options.screens, (val) => { return { label: val.name, value: val.id } });
    screenOptions.unshift( { label: '不显示页面', value: '' } );;

    const relationOptions = [{ label: 'AND', value: 'and' }, { label: 'OR', value: 'or' }];

    const stateOptions = options.states || [];
    const permissionOptions = options.permissions || [];
    const roleOptions = options.roles || [];
    const resolutionOptions = options.resolutions || [];
    const assigneeOptions = [ { id: 'whoami', name: '当前用户' }, { id: 'reporter', name: '报告人' }, { id: 'principal', name: '项目负责人' } ];

    const selectEnableStyles = { width: '130px', marginLeft: '10px' }; 
    const selectDisabledStyles = { width: '130px', marginLeft: '10px', backgroundColor: '#f5f5f5' }; 

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>添加动作</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' } style={ { height: '450px' } }>
          <Tabs
            activeKey={ this.state.activeKey }
            onTabClick={ this.onTabClick.bind(this) } 
            onChange={ this.onTabChange.bind(this) } >
            <TabPane tab='基本' key='1'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>原步骤</ControlLabel>
                  <FormControl type='text' value={ stepData.name } disabled={ true }/>
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>动作名</ControlLabel>
                  <FormControl type='text' { ...name } placeholder='动作名'/>
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>目标步骤</ControlLabel>
                  <Select options={ stepOptions } simpleValue value={ dest_step.value } onChange={ newValue => { dest_step.onChange(newValue) } } placeholder='请选择目标步骤' clearable={ false } searchable={ false }/>
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>动作界面</ControlLabel>
                  <Select options={ screenOptions } simpleValue value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='请选择界面' clearable={ false } searchable={ false }/>
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='触发条件' key='2'>
              <div style={ { paddingTop: '25px', paddingBottom: '25px' } }>
                <Select options={ relationOptions } simpleValue value={ relation.value } onChange={ newValue => { relation.onChange(newValue) } } placeholder='条件关系' clearable={ false } searchable={ false }/>
              </div>
              <ui className='list-unstyled clearfix cond-list'>
                <CheckboxGroup name='conditions' value={ this.state.conditions } onChange={ this.conditionsChanged.bind(this) }>
                  <li>
                    <Checkbox value='isReporter'/>
                    <span>只有</span><b>报告人</b><span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='isAssignee'/>
                    <span>只有</span><b>经办人</b><span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='checkSubTasksState'/>
                    <span>根据子任务状态</span>
                    <select 
                      { ...stateParam } 
                      disabled={ _.indexOf(this.state.conditions, 'checkSubTasksState') !== -1 ? false : true } 
                      style={ _.indexOf(this.state.conditions, 'checkSubTasksState') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择状态</option>
                      { stateOptions.map( stateOption => <option value={ stateOption.id } key={ stateOption.id }>{ stateOption.name }</option> ) }
                    </select>
                    <span>限制父任务动作</span>
                  </li>
                  <li>
                    <Checkbox value='hasPermission'/>
                    <span>只有具有权限</span>
                    <select 
                      { ...permissionParam } 
                      disabled={ _.indexOf(this.state.conditions, 'hasPermission') !== -1 ? false : true }
                      style={ _.indexOf(this.state.conditions, 'hasPermission') !== -1 ? selectEnableStyles : selectDisabledStyles }>
                      <option value='' key=''>请选择权限</option>
                      { permissionOptions.map( permissionOption => <option value={ permissionOption.id } key={ permissionOption.id }>{ permissionOption.name }</option> ) }
                    </select>
                    <span>的用户才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='belongsToRole'/>
                    <span>只有属于项目角色</span>
                    <select
                      { ...roleParam }
                      disabled={ _.indexOf(this.state.conditions, 'belongsToRole') !== -1 ? false : true }
                      style={ _.indexOf(this.state.conditions, 'belongsToRole') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择角色</option>
                      { roleOptions.map( roleOption => <option value={ roleOption.id } key={ roleOption.id }>{ roleOption.name }</option> ) }
                    </select>
                    <span>的成员才能执行此动作</span>
                  </li>
                </CheckboxGroup>
              </ui>
            </TabPane>
            <TabPane tab='结果处理' key='3'>
              <div style={ { paddingTop: '25px', paddingBottom: '25px' } }>
                <span><b>发生转变之后下面功能将被执行</b></span>
              </div>
              <ui className='list-unstyled clearfix cond-list'>
                <CheckboxGroup name='postFunctions' value={ this.state.postFunctions } onChange={ this.postFunctionsChanged.bind(this) }>
                  <li>
                    <Checkbox value='setResolution'/>
                    <span>问题的</span><b>解决结果</b><span>将被设置为</span>
                    <select
                      { ...resolutionParam }
                      disabled={ _.indexOf(this.state.postFunctions, 'setResolution') !== -1 ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'setResolution') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择结果值</option>
                      { resolutionOptions.map( resolutionOption => <option value={ resolutionOption.id } key={ resolutionOption.id }>{ resolutionOption.name }</option> ) }
                    </select>
                  </li>
                  <li>
                    <Checkbox value='setState'/>
                    <span>将状态设置为目标步骤链接的状态</span>
                  </li>
                  <li>
                    <Checkbox value='assignIssue'/>
                    <span>将问题分配给</span>
                    <select
                      { ...assigneeParam }
                      disabled={ _.indexOf(this.state.postFunctions, 'assignIssue') !== -1 ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'assignIssue') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择经办人</option>
                      { assigneeOptions.map( assigneeOption => <option value={ assigneeOption.id } key={ assigneeOption.id }>{ assigneeOption.name }</option> ) }
                    </select>
                  </li>
                  <li>
                    <Checkbox value='addComments'/>
                    <span>如果用户输入了备注，将备注添加到问题中</span>
                  </li>
                  <li>
                    <Checkbox value='updateHistory'/>
                    <span>更新问题的变动历史记录</span>
                  </li>
                  <li>
                    <Checkbox value='triggerWebhook'/>
                    <span>引发一个Webhook（待开发）</span>
                  </li>
                </CheckboxGroup>
              </ui>
            </TabPane>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button className='ralign' disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
