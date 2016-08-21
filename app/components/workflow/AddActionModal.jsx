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
  fields: [ 'src_step', 'name', 'dest_step', 'screen' ],
  validate
})
export default class AddActionModal extends Component {
  constructor(props) {
    super(props);
    this.state = { activeKey: '1', fruits: ['apple','watermelon'] };
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

  fruitsChanged(newFruits) {
    this.setState({
      fruits: newFruits
    });
  }

  render() {
    const { fields: { src_step, name, dest_step, screen }, options, steps, stepData, handleSubmit, invalid, submitting } = this.props;
    const stepOptions = _.map(steps, (val) => { return { label: val.name, value: val.id } });
    stepOptions.splice(_.findIndex(steps, { id: stepData.id }), 1);

    const screenOptions = _.map(options.screens, (val) => { return { label: val.name, value: val.id } });
    screenOptions.unshift( { label: '不显示页面', value: '' } );;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>添加动作</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' }>
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
                <Select options={ screenOptions } simpleValue value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='条件关系' clearable={ false } searchable={ false }/>
              </div>
              <ui className='list-unstyled clearfix cond-list'>
                <CheckboxGroup name='fruits' value={ this.state.fruits } onChange={ this.fruitsChanged }>
                  <li>
                    <Checkbox value='apple'/>
                    <span>只有</span><b>报告人</b><span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='orange'/>
                    <span>只有</span><b>经办人</b><span>才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='watermelon'/>
                    <span>根据子任务状态</span>
                    <select options={ screenOptions } value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='请选择界面' style={ { width: '100px', marginLeft: '10px' } }/> 
                    <span>限制父任务动作</span>
                  </li>
                  <li>
                    <Checkbox value='watermelon'/>
                    <span>只有具有权限</span>
                    <select options={ screenOptions } value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='请选择界面' style={ { width: '100px', marginLeft: '10px' } }/> 
                    <span>的用户才能执行此动作</span>
                  </li>
                  <li>
                    <Checkbox value='watermelon'/>
                    <span>只有属于项目角色</span>
                    <select options={ screenOptions } value={ screen.value } onChange={ newValue => { screen.onChange(newValue) } } placeholder='请选择界面' style={ { width: '100px', marginLeft: '10px' } }/>
                    <span>的成员才能执行此动作</span>
                  </li>
                </CheckboxGroup>
              </ui>
            </TabPane>
            <TabPane tab='结果处理' key='3'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>动作名2</ControlLabel>
                  <FormControl type='text' { ...name } placeholder='工作流名'/>
                </FormGroup>
              </div>
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
