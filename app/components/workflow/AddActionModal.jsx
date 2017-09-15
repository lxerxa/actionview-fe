import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import Tabs, { TabPane } from 'rc-tabs';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import _ from 'lodash';

const CONDITION_FUNCTIONS = {
  isSome: { name: 'App\\Workflow\\Func@isSome', args: [ 'someParam' ], sn: 1 },
  isTheUser: { name: 'App\\Workflow\\Func@isTheUser', args: [ 'userParam' ], sn: 2 },
  checkSubTasksState: { name: 'App\\Workflow\\Func@checkSubTasksState', args: [ 'stateParam' ], sn: 3 },
  hasPermission: { name: 'App\\Workflow\\Func@hasPermission', args: [ 'permissionParam' ], sn: 4 },
  belongsToRole: { name: 'App\\Workflow\\Func@belongsToRole', args: [ 'roleParam' ], sn: 5 }
};

const POST_FUNCTIONS = {
  setResolution: { name : 'App\\Workflow\\Func@setResolution', args: [ 'resolutionParam' ], sn: 1 },
  assignIssue: { name : 'App\\Workflow\\Func@assignIssue', args: [ 'assigneeParam' ], sn: 2 },
  assignIssueToUser: { name : 'App\\Workflow\\Func@assignIssueToUser', args: [ 'assignedUserParam' ], sn: 3 },
  setState: { name : 'App\\Workflow\\Func@setState', sn: 4 },
  addComments: { name : 'App\\Workflow\\Func@addComments', sn: 5 },
  //updateHistory: { name : 'App\\Workflow\\Util@updateHistory', sn: 6 }
  updIssue: { name : 'App\\Workflow\\Func@updIssue', sn: 9 },
  triggerEvent: { name : 'App\\Workflow\\Func@triggerEvent', args: [ 'eventParam' ], sn: 10 }
};

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }
  if (!values.destStep) {
    errors.destStep = '必选';
  }
  //if (!values.screen) {
  //  errors.name = 'Required';
  //}
  return errors;
};

@reduxForm({
  form: 'wfconfig',
  fields: [ 'id', 'name', 'destStep', 'screen' ],
  validate
})
export default class AddActionModal extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      activeKey: '1', 
      conditions: [], 
      postFunctions: [ 
        'setState', 
        'addComments', 
        'triggerEvent', 
        'updIssue' ], 
      relation: '', 
      someParam: '', 
      userParam: '', 
      stateParam: '', 
      permissionParam: '', 
      roleParam:'', 
      resolutionParam: '', 
      assigneeParam: '', 
      assignedUserParam: '', 
      eventParam: 'normal' };

    const state = this.state;
    const { data } = props;
    if (!_.isEmpty(data)) {
      if (data.restrict_to && data.restrict_to.conditions && data.restrict_to.conditions.list.length > 0) {
        this.state.conditions = _.map(data.restrict_to.conditions.list, function(value) { 
          value.args && _.assign(state, value.args);
          return _.findKey(CONDITION_FUNCTIONS, { name: value.name });
        });
        this.state.relation = data.restrict_to.conditions.type || 'and';
      }

      if (data.post_functions && data.post_functions.length > 0) {
        this.state.postFunctions = _.map(data.post_functions, function(value) { 
          value.args && _.assign(state, value.args);
          return _.findKey(POST_FUNCTIONS, { name: value.name });
        });
      }
    }
    // special handling
    if (_.indexOf(this.state.postFunctions, 'triggerEvent') === -1) {
      this.state.eventParam = '';
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    options: PropTypes.object,
    data: PropTypes.object,
    stepData: PropTypes.object,
    steps: PropTypes.array,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    initializeForm: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
  }

  handleSubmit() {
    const { values, create, edit, close, stepData } = this.props;

    const addedAction = {};
    addedAction.id = values.id;
    addedAction.name = values.name;
    addedAction.screen = values.screen;
    addedAction.results = [ { step: values.destStep, old_status: 'Finished', status: 'Underway' } ];

    const postFunctions = [];
    const postFuncsLength = this.state.postFunctions.length;
    for (let i = 0; i < postFuncsLength; i++) {
      const funcKey = this.state.postFunctions[i];
      if (!POST_FUNCTIONS[funcKey]) {
        continue;
      }
      const funcArgs = {};
      const argsLength = POST_FUNCTIONS[funcKey].args ? POST_FUNCTIONS[funcKey].args.length : 0;
      let validFlag = 1;
      for (let j = 0; j < argsLength; j++) {
        const arg = (POST_FUNCTIONS[funcKey].args)[j];
        if (!this.state[arg]) {
          validFlag = 0;
          break;
        }
        funcArgs[arg] = this.state[arg];
      }

      if (validFlag === 1) {
        argsLength > 0 ?
          postFunctions.push({ name: POST_FUNCTIONS[funcKey].name, args: funcArgs, sn: POST_FUNCTIONS[funcKey].sn }) :
          postFunctions.push({ name: POST_FUNCTIONS[funcKey].name, sn: POST_FUNCTIONS[funcKey].sn })
      }
    }
    if (postFunctions.length > 0) {
      addedAction.post_functions = _.map(_.sortBy(postFunctions, 'sn'), function(value) { return _.pick(value, ['name', 'args']); });
    }

    const restrictConditions = [];
    const restrictCondLength = this.state.conditions.length;
    for (let i = 0; i < restrictCondLength; i++) {
      const condKey = this.state.conditions[i];
      if (!CONDITION_FUNCTIONS[condKey]) {
        continue;
      }
      const condArgs = {};
      let validFlag = 1;
      const argsLength = CONDITION_FUNCTIONS[condKey].args ? CONDITION_FUNCTIONS[condKey].args.length : 0;
      for (let j = 0; j < argsLength; j++) {
        const arg = (CONDITION_FUNCTIONS[condKey].args)[j];
        if (!this.state[arg]) {
          validFlag = 0;
          break;
        }
        condArgs[arg] = this.state[arg];
      }

      if (validFlag === 1) {
        argsLength > 0 ?
          restrictConditions.push({ name: CONDITION_FUNCTIONS[condKey].name, args: condArgs, sn: CONDITION_FUNCTIONS[condKey].sn }) :
          restrictConditions.push({ name: CONDITION_FUNCTIONS[condKey].name, sn: CONDITION_FUNCTIONS[condKey].sn })
      }
    }

    if (restrictConditions.length > 0)
    {
      const rcs = _.map(_.sortBy(restrictConditions, 'sn'), function(value) { return _.pick(value, ['name', 'args']); });
      addedAction.restrict_to = { conditions: { type: this.state.relation ? this.state.relation : 'and', list: rcs } };
    }

    //alert(JSON.stringify(addedAction));
    //return;

    values.id ? edit(stepData.id, addedAction) : create(stepData.id, addedAction);
    close();
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    close();
  }

  componentWillMount() {
    const { initializeForm, data } = this.props;
    const basicData = {};
    if (!_.isEmpty(data))
    {
      basicData.id = data.id;
      basicData.name = data.name;
      basicData.destStep = data.results[0].step;
      basicData.screen = data.screen;
    }
    else
    {
      basicData.id = '';
      basicData.name = '';
      basicData.destStep = '';
      basicData.screen = '';
    }
    initializeForm(basicData);
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
    // const { fields: { name, destStep, screen, relation, stateParam, permissionParam, roleParam, resolutionParam, assigneeParam, eventParam }, options, steps, stepData, handleSubmit, invalid, submitting } = this.props;
    const { fields: { id, name, destStep, screen }, options, steps, stepData, handleSubmit, invalid, submitting, data } = this.props;

    //const goneSteps = [ stepData.id ];
    //_.map(stepData.actions, (action) => {
    //  _.map(action.results || [], (result) => {
    //    goneSteps.push(result.step);
    //  })
    //});

    //const stepOptions = _.map(_.filter(steps, (o) => { return _.indexOf(goneSteps, o.id) === -1 || o.id == (data && data.results ? data.results[0].step : '') } ), (val) => { return { label: val.name, value: val.id } });
    const stepOptions = _.map(_.filter(steps, (o) => { return stepData.id !== o.id }), (val) => { return { label: val.name, value: val.id } });

    const screenOptions = _.map(options.screens, (val) => { return { label: val.name, value: val.id } });
    //screenOptions.unshift( { label: '流程备注页面', value: 'comments' } );;

    const relationOptions = [{ label: '全部满足', value: 'and' }, { label: '满足任何一个即可', value: 'or' }];
    const someOptions = [ { id: 'assignee', name: '经办人' }, { id: 'reporter', name: '报告人' }, { id: 'principal', name: '项目负责人' } ];
    const assigneeOptions = [ { id: 'me', name: '当前用户' }, { id: 'reporter', name: '报告人' }, { id: 'principal', name: '项目负责人' } ];

    const userOptions = (options.users || []).sort(function(a, b) { return a.name.localeCompare(b.name); });

    const eventOptions = options.events || [];
    const stateOptions = options.states || [];
    const permissionOptions = _.reject(require('../share/Permissions.js'), { id: 'all' });
    const roleOptions = options.roles || [];
    const resolutionOptions = options.resolutions || [];

    const selectEnableStyles = { width: '125px', marginLeft: '10px', backgroundColor: '#ffffff', borderRadius: '4px' }; 
    const selectDisabledStyles = { width: '125px', marginLeft: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }; 

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ data.id ? ('编辑查看动作 - ' + data.name) : '添加动作' } </Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) } onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { height: '420px' } }>
          <FormControl type='hidden' { ...id }/>
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
                <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>动作名</ControlLabel>
                  <FormControl disabled={ submitting } type='text' { ...name } placeholder='动作名'/>
                  { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel><span className='txt-impt'>*</span>目标步骤</ControlLabel>
                  <Select disabled={ submitting } options={ stepOptions } simpleValue value={ destStep.value } onChange={ newValue => { destStep.onChange(newValue) } } placeholder='请选择目标步骤' clearable={ false } searchable={ false }/>
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>动作界面</ControlLabel>
                  <Select disabled={ submitting } options={ screenOptions } simpleValue value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='无界面' searchable={ false }/>
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='触发条件' key='2'>
              <div style={ { paddingTop: '15px', paddingBottom: '15px', paddingLeft: '5px' } }>
                <Select options={ relationOptions } simpleValue value={ this.state.relation } onChange={ newValue => { this.setState({ relation: newValue }) } } placeholder='条件关系' clearable={ false } searchable={ false }/>
              </div>
              <CheckboxGroup name='conditions' value={ this.state.conditions } onChange={ this.conditionsChanged.bind(this) }>
                <ui className='list-unstyled clearfix cond-list'>
                  <li>
                    <Checkbox disabled={ submitting } value='isSome'/>
                    <span>只有</span>
                    <select
                      value={ this.state.someParam }
                      onChange={ (e) => this.setState({ someParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.conditions, 'isSome') !== -1 && !submitting) ? false : true } 
                      style={ _.indexOf(this.state.conditions, 'isSome') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择用户</option>
                      { someOptions.map( someOption => <option value={ someOption.id } key={ someOption.id }>{ someOption.name }</option> ) }
                    </select>
                    <span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='isTheUser'/>
                    <span>只有用户</span>
                    <select
                      value={ this.state.userParam }
                      onChange={ (e) => this.setState({ userParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.conditions, 'isTheUser') !== -1 && !submitting) ? false : true } 
                      style={ _.indexOf(this.state.conditions, 'isTheUser') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择用户</option>
                      { userOptions.map( userOption => <option value={ userOption.id } key={ userOption.id }>{ userOption.name + '(' + userOption.email + ')' }</option> ) }
                    </select>
                    <span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='checkSubTasksState'/>
                    <span>根据子任务状态</span>
                    <select 
                      value={ this.state.stateParam }
                      onChange={ (e) => this.setState({ stateParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.conditions, 'checkSubTasksState') !== -1 && !submitting) ? false : true } 
                      style={ _.indexOf(this.state.conditions, 'checkSubTasksState') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择状态</option>
                      { stateOptions.map( stateOption => <option value={ stateOption.id } key={ stateOption.id }>{ stateOption.name }</option> ) }
                    </select>
                    <span>限制父任务动作</span>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='hasPermission'/>
                    <span>只有具有权限</span>
                    <select 
                      value={ this.state.permissionParam }
                      onChange={ (e) => this.setState({ permissionParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.conditions, 'hasPermission') !== -1 && !submitting) ? false : true }
                      style={ _.indexOf(this.state.conditions, 'hasPermission') !== -1 ? selectEnableStyles : selectDisabledStyles }>
                      <option value='' key=''>请选择权限</option>
                      { permissionOptions.map( permissionOption => <option value={ permissionOption.id } key={ permissionOption.id }>{ permissionOption.name }</option> ) }
                    </select>
                    <span>的用户才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='belongsToRole'/>
                    <span>只有属于项目角色</span>
                    <select
                      value={ this.state.roleParam }
                      onChange={ (e) => this.setState({ roleParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.conditions, 'belongsToRole') !== -1 && !submitting) ? false : true }
                      style={ _.indexOf(this.state.conditions, 'belongsToRole') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择角色</option>
                      { roleOptions.map( roleOption => <option value={ roleOption.id } key={ roleOption.id }>{ roleOption.name }</option> ) }
                    </select>
                    <span>的成员才能执行此动作</span>
                  </li>
                </ui>
              </CheckboxGroup>
            </TabPane>
            <TabPane tab='结果处理' key='3'>
              <div style={ { paddingTop: '15px', paddingBottom: '15px', paddingLeft: '5px' } }>
                <span><b>发生转变之后下面功能将被执行</b></span>
              </div>
              <CheckboxGroup name='postFunctions' value={ this.state.postFunctions } onChange={ this.postFunctionsChanged.bind(this) }>
                <ui className='list-unstyled clearfix cond-list'>
                  <li>
                    <Checkbox disabled={ submitting } value='setResolution'/>
                    <span>问题的</span><b>解决结果</b><span>将被设置为</span>
                    <select
                      value={ this.state.resolutionParam }
                      onChange={ (e) => this.setState({ resolutionParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.postFunctions, 'setResolution') !== -1 && !submitting) ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'setResolution') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择结果值</option>
                      { resolutionOptions.map( resolutionOption => <option value={ resolutionOption.id } key={ resolutionOption.id }>{ resolutionOption.name }</option> ) }
                    </select>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='assignIssue'/>
                    <span>将问题分配给</span>
                    <select
                      value={ this.state.assigneeParam }
                      onChange={ (e) => this.setState({ assigneeParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.postFunctions, 'assignIssue') !== -1 && !submitting) ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'assignIssue') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择经办人</option>
                      { assigneeOptions.map( assigneeOption => <option value={ assigneeOption.id } key={ assigneeOption.id }>{ assigneeOption.name }</option> ) }
                    </select>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='assignIssueToUser'/>
                    <span>将问题分配给指定用户</span>
                    <select
                      value={ this.state.assignedUserParam }
                      onChange={ (e) => this.setState({ assignedUserParam: e.target.value }) }
                      disabled={ (_.indexOf(this.state.postFunctions, 'assignIssueToUser') !== -1 && !submitting) ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'assignIssueToUser') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择用户</option>
                      { userOptions.map( userOption => <option value={ userOption.id } key={ userOption.id }>{ userOption.name }</option> ) }
                    </select>
                  </li>
                  <li>
                    <Checkbox value='setState'/>
                    <span>将状态设置为目标步骤链接的状态</span>
                  </li>
                  <li>
                    <Checkbox disabled={ submitting } value='addComments'/>
                    <span>如果用户输入了备注，将备注添加到问题中</span>
                  </li>
                  <li style={ { display: 'none' } }>
                    <Checkbox disabled={ submitting } value='updIssue'/>
                    <span>更新问题属性</span>
                  </li>
                  {/*
                  <li>
                    <Checkbox disabled={ submitting } value='updateHistory'/>
                    <span>更新问题的变动历史记录</span>
                  </li>
                  */}
                  <li>
                    <Checkbox value='triggerEvent'/>
                    <span>过程结束后触发</span>
                    <select
                      value={ this.state.eventParam }
                      onChange={ (e) => this.setState({ eventParam: e.target.value }) }
                      disabled={ _.indexOf(this.state.postFunctions, 'triggerEvent') !== -1 ? false : true }
                      style={ _.indexOf(this.state.postFunctions, 'triggerEvent') !== -1 ? selectEnableStyles : selectDisabledStyles }> 
                      <option value='' key=''>请选择事件</option>
                      { eventOptions.map( eventOption => <option value={ eventOption.id } key={ eventOption.id }>{ eventOption.name }</option> ) }
                    </select>
                    <span>通知事件</span>
                  </li>
                </ui>
              </CheckboxGroup>
            </TabPane>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button bsStyle='link' disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
