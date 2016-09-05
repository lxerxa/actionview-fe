import React, { PropTypes, Component } from 'react';
import { Button, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateStepModal = require('./CreateStepModal');
const PreviewModal = require('./PreviewModal');
const img = require('../../assets/images/loading.gif');

export default class ConfigHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { createStepModalShow: false, previewModalShow: false, errMsg: '' };
    this.createStepModalClose = this.createStepModalClose.bind(this);
    this.previewModalClose = this.previewModalClose.bind(this);
  }

  static propTypes = {
    pid: PropTypes.string.isRequired,
    workflowName: PropTypes.string,
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

  previewModalClose() {
    this.setState({ previewModalShow: false });
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

    const isolatedSteps = _.intersection(startSteps, endSteps);

    if (isolatedSteps.length > 0 || startSteps.length !== 1 || endSteps.length !== 1) {
      if (isolatedSteps.length > 0) {
        this.setState({ errMsg: '格式错误：不能有孤点。' });
      } else if (startSteps.length < 1) {
        this.setState({ errMsg: '格式错误：没有起点。' });
      } else if (startSteps.length > 1) {
        this.setState({ errMsg: '格式错误：只能有一个起点。' });
      } else if (endSteps.length < 1) {
        this.setState({ errMsg: '格式错误：没有终点。' });
      } else if (endSteps.length > 1) {
        this.setState({ errMsg: '格式错误：只能有一个终点。' });
      } else {
        this.setState({ errMsg: '格式错误' });
      }
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
          <Button className='create-btn' onClick={ this.saveWorkflow.bind(this) } disabled={ newCollection2JSON === collection2JSON || collection.length <= 0 }><i className='fa fa-save'></i>&nbsp;保存</Button>
          <Label style={ { color: 'red', backgroundColor: '#ffffbd' } }>{ this.state.errMsg }</Label>
          <Label style={ { color: 'red', backgroundColor: '#ffffbd' } }>{ ecode !== 0 ? '保存失败，请重试' : '' }</Label>
          <image src={ img } className={ saveLoading ? 'loading' : 'hide' }/>
          <Button className='create-btn' style={ { float: 'right' } } onClick={ () => { this.setState({ previewModalShow: true }); } } disabled={ collection.length <= 0 }><i className='fa fa-search'></i>&nbsp;预览</Button>
        </div>
        { this.state.createStepModalShow && <CreateStepModal show close={ this.createStepModalClose } create={ createStep } options={ options }/> }
        { this.state.previewModalShow && <PreviewModal show close={ this.previewModalClose } collection={ collection } /> }
      </div>
    );
  }
}
