import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateStepModal = require('./CreateStepModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createStepModalShow: false, errMsg: '' };
    this.createStepModalClose = this.createStepModalClose.bind(this);
  }

  static propTypes = {
    pid: PropTypes.string.isRequired,
    workflowId: PropTypes.string.isRequired,
    workflowName: PropTypes.string.isRequired,
    ecode: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    collection2JSON: PropTypes.string.isRequired,
    saveLoading: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    createStep: PropTypes.func.isRequired
  }

  createStepModalClose() {
    this.setState({ createStepModalShow: false });
  }

  saveWorkflow() {
    const { save, collection, workflowName } = this.props;

    const allSteps = [];
    const startSteps = [];
    const endSteps = [];
    const tmpSteps = [];

    const stepNum = collection.length;
    for (let i = 0; i < stepNum; i++) {
      allSteps.push(collection[i].id);
      if (!collection[i].actions || collection[i].actions.length <= 0)
      {
        endSteps.push(collection[i].id);
        continue;
      }

      _.map(collection[i].actions, function(v) {
        _.map(v.results, function(v2) {
          tmpSteps.push(v2.step);
        });
      });
    }
    _.map(_.xor(allSteps, tmpSteps), function(v) {
      startSteps.push(v);
    });

    if (startSteps.length !== 1 || endSteps.length !== 1 || _.isEqual(startSteps, endSteps))
    {
      this.setState({ errMsg: '配置格式有误' });
      return;
    }

    const initialActions = { id : 0, name: 'initial_action', results: [{ step: startSteps[0], status: 'Underway' }] };

    save({ contents : { name: workflowName, initial_actions: initialActions, step: collection } });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errMsg: '' });
  }

  render() {
    const { createStep, options, pid, collection, collection2JSON, workflowName, saveLoading, ecode } = this.props;

    const newCollection2JSON = JSON.stringify(collection);

    return (
      <div>
        <h2>#工作流配置 - { workflowName }#</h2>
        { newCollection2JSON !== collection2JSON && collection.length > 0 && 
          <div style={ { marginTop: '20px', marginBottom: '10px', padding: '8px', backgroundColor: '#ffffbd' } }>&nbsp;<i className='fa fa-exclamation-triangle'></i>&nbsp;&nbsp;配置已修改，需保存后才能生效。</div>
        }
        <div>
          <Link to={ '/project/' + pid + '/workflow' }>
            <Button className='create-btn'><i className='fa fa-reply'></i>&nbsp;返回</Button>
          </Link>
          <Button className='create-btn' onClick={ () => { this.setState({ createStepModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建步骤</Button>
          <Button className='create-btn' onClick={ this.saveWorkflow.bind(this) } disabled={ newCollection2JSON === collection2JSON ? true : false }><i className='fa fa-save'></i>&nbsp;保存</Button>
          <span style={ { color: 'red' } }>{ this.state.errMsg }</span>
          <span style={ { color: 'red' } }>{ ecode !== 0 ? '保存失败' : '' }</span>
          <image src={ img } className={ saveLoading ? 'loading' : 'hide' }/>
          <Button className='create-btn' style={ { float: 'right' } } onClick={ () => { this.setState({ createStepModalShow: true }); } }><i className='fa fa-search'></i>&nbsp;预览</Button>
        </div>
        { this.state.createStepModalShow && <CreateStepModal show close={ this.createStepModalClose } create={ createStep } options={ options }/> }
      </div>
    );
  }
}
