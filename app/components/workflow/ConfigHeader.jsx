import React, { PropTypes, Component } from 'react';
import { Button, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const CreateStepModal = require('./CreateStepModal');
const ConfigNotify = require('./ConfigNotify');
const PreviewModal = require('./PreviewModal');
const img = require('../../assets/images/loading.gif');

export default class ConfigHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { createStepModalShow: false, saveNotify: false, previewModalShow: false, errMsg: '' };
    this.createStepModalClose = this.createStepModalClose.bind(this);
    this.saveNotifyClose = this.saveNotifyClose.bind(this);
    this.cancelNotifyClose = this.cancelNotifyClose.bind(this);
    this.previewModalClose = this.previewModalClose.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
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
    cancel: PropTypes.func.isRequired,
    createStep: PropTypes.func.isRequired
  }

  createStepModalClose() {
    this.setState({ createStepModalShow: false });
  }

  saveNotifyClose() {
    this.setState({ saveNotifyShow: false });
  }

  cancelNotifyClose() {
    this.setState({ cancelNotifyShow: false });
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

  saveConfig() {
    const { collection } = this.props;

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
      this.setState({ saveNotifyShow: true });
      return;
    } else {
      this.save();
    }
  }

  async save() {
    const { save, collection } = this.props;

    const initialActions = { id : 0, name: 'initial_action', results: [{ step: collection[0].id, status: 'Underway' }] };

    const ecode = await save({ contents : { initial_action: initialActions, steps: collection } });
    if (ecode === 0) {
      notify.show('保存成功。', 'success', 2000);
    } else {
      notify.show('保存失败，请重试。', 'error', 2000);
    }
  }

  cancelConfig() {
    this.setState({ cancelNotifyShow: true });
  }

  cancel() {
    const { cancel } = this.props;
    cancel();
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
        <div style={ { marginTop: '20px', marginBottom: '10px', padding: '8px', backgroundColor: '#ffffbd', border: '1px solid #ccc' } }>
          <span><i className='fa fa-exclamation-triangle'></i>&nbsp;&nbsp;配置已修改，需保存后才能生效。</span>
          <Button 
            onClick={ this.saveConfig.bind(this) } 
            disabled={ saveLoading }>
            <i className='fa fa-save'></i>&nbsp;保存
          </Button>
          <Button
            bsStyle='link'
            onClick={ this.cancelConfig.bind(this) } >
            取消修改 
          </Button>
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
        <div className='info-col'>
          <div className='info-icon'>
            <i className='fa fa-info-circle'></i>
          </div>
          <div className='info-content'>
            配置工作流时应先新建工作流步骤，然后再添加相关的动作。<br/>每一步骤相关联的状态在状态模块中定义。
          </div>
        </div>
        { this.state.createStepModalShow && 
          <CreateStepModal 
            show 
            close={ this.createStepModalClose } 
            create={ createStep } 
            options={ options } 
            collection={ collection }/> }
        { this.state.saveNotifyShow &&
          <ConfigNotify
            show
            close={ this.saveNotifyClose }
            save={ this.save } /> }
        { this.state.cancelNotifyShow &&
          <ConfigNotify
            show
            close={ this.cancelNotifyClose }
            cancel={ this.cancel } /> }
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
