import React, { PropTypes, Component } from 'react';
import { Button, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

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
    pathname: PropTypes.string.isRequired,
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

  dfsVisit(treeNodes, nodeId, vistedNodes) {
    if (_.indexOf(vistedNodes, nodeId) !== -1) {
      return;
    }

    vistedNodes.push(nodeId);

    const DestNodes = treeNodes[nodeId];
    const nodeNum = DestNodes.length;
    for (let i = 0; i < nodeNum; i++) {
      this.dfsVisit(treeNodes, DestNodes[i], vistedNodes);
    }
  }

  async saveWorkflow() {
    const { save, collection, workflowName } = this.props;

    const allSteps = [];
    const stepTree = {}; 

    const stepNum = collection.length;
    for (let i = 0; i < stepNum; i++) {
      allSteps.push(collection[i].id);
      stepTree[collection[i].id] = [];

      if (!collection[i].actions || collection[i].actions.length <= 0) {
        continue;
      }

      _.map(collection[i].actions, function(v) {
        _.map(v.results, function(v2) {
          stepTree[collection[i].id].push(v2.step);
        });
      });
    }

    const visitedSteps = [];
    this.dfsVisit(stepTree, 1, visitedSteps);

    if (_.xor(allSteps, visitedSteps).length > 0) {
      this.setState({ errMsg: '格式错误, 请预览查看' });
      return;
    }

    const initialActions = { id : 0, name: 'initial_action', results: [{ step: collection[0].id, status: 'Underway' }] };

    const ecode = await save({ contents : { initial_action: initialActions, steps: collection } });
    if (ecode === 0) {
      notify.show('保存成功。', 'success', 2000);
    } else {
      notify.show('保存失败。', 'error', 2000);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errMsg: '', ecode: 0 });
  }

  render() {
    const { createStep, options, pathname, collection, collection2JSON, workflowName, saveLoading, ecode } = this.props;

    const newCollection2JSON = JSON.stringify(collection);

    return (
      <div>
        { newCollection2JSON !== collection2JSON && collection.length > 0 && 
        <div style={ { marginTop: '20px', marginBottom: '10px', padding: '8px', backgroundColor: '#ffffbd' } }>
          <span><i className='fa fa-exclamation-triangle'></i>&nbsp;&nbsp;配置已修改，需保存后才能生效。</span>
          <Button 
            onClick={ this.saveWorkflow.bind(this) } 
            disabled={ newCollection2JSON === collection2JSON || collection.length <= 0 }>
            <i className='fa fa-save'></i>&nbsp;保存
          </Button>
          <span style={ { color: 'red', backgroundColor: '#ffffbd', marginLeft: '10px' } }>
            { this.state.errMsg != '' ? this.state.errMsg : (ecode !== 0 ? '保存失败，请重试。' : '') }
          </span>
          <img src={ img } className={ saveLoading ? 'loading' : 'hide' }/>
        </div> }
        <div style={ { marginTop: '5px' } }>
          <Link to={ pathname.substr(0, pathname.lastIndexOf('/')) }>
            <Button className='create-btn'><i className='fa fa-reply'></i>&nbsp;返回</Button>
          </Link>
          <Button 
            className='create-btn' 
            onClick={ () => { this.setState({ previewModalShow: true }); } } 
            disabled={ collection.length <= 0 }>
            <i className='fa fa-search'></i>&nbsp;预览
          </Button>
          <Button 
            className='create-btn' 
            onClick={ () => { this.setState({ createStepModalShow: true }); } }>
            <i className='fa fa-plus'></i>&nbsp;新建步骤
          </Button>
          <span style={ { float: 'right', marginTop: '20px', marginRight: '10px', fontWeight: 'bold' } }>{ workflowName }</span>
          <span style={ { float: 'right', marginTop: '20px' } }>工作流名称：</span>
        </div>
        { this.state.createStepModalShow && 
          <CreateStepModal 
            show 
            close={ this.createStepModalClose } 
            create={ createStep } 
            options={ options } 
            collection={ collection }/> }
        { this.state.previewModalShow && 
          <PreviewModal 
            show 
            close={ this.previewModalClose } 
            collection={ collection } 
            name={ workflowName } /> }
      </div>
    );
  }
}
