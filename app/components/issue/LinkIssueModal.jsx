import React, { PropTypes, Component } from 'react';
import { Modal, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import ApiClient from '../../../shared/api-client';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class LinkIssueModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, relation: '', dest: '' };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    createLink: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired
  }

  async confirm() {
    const { close, createLink, issue } = this.props;
    const values = {};
    values.src = issue.id;
    values.relation = this.state.relation;
    values.dest = this.state.dest && this.state.dest.id || '';
    const ecode = await createLink(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('链接已创建。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close } = this.props;
    close();
  }

  async searchIssue(input) {
    input = input.toLowerCase();
    if (!input)
    {
      return { options: [] };
    }

    const { issue, types, project } = this.props;
    if (!issue.links) {
      issue.links = [];
    }

    const hasLinkedIds = [];
    _.map(issue.links, (v) => {
      hasLinkedIds.push(v.src.id == issue.id ? v.dest.id : v.src.id);
    }); 

    const api = new ApiClient;
    let limit = 10;
    if (issue.links.length > 0) {
      limit = issue.links.length + 10; 
    }
    const results = await api.request( { url: '/project/' + project.key + '/issue/search?s=' + input + '&limit=' + limit } );

    const options = [];
    if (results.data.length > 0)
    {
      _.map(results.data, (v) => {
        if (_.indexOf(hasLinkedIds, v.id) === -1 && issue.id !== v.id) {
          options.push({ id: v.id, name: _.find(types, { id: v.type }).name + '/' + v.no + ' - ' + v.title });
        }
      });
    }
    return { options };
  }

  render() {
    const { i18n: { errMsg }, loading } = this.props;

    const relationOptions = [ 
      { value: 'blocks', label: 'blocks' }, 
      { value: 'is blocked by', label: 'is blocked by' }, 
      { value: 'clones', label: 'clones' }, 
      { value: 'is cloned by', label: 'is cloned by' }, 
      { value: 'duplicates', label: 'duplicates' }, 
      { value: 'is duplicated by', label: 'is duplicated by' }, 
      { value: 'relates to', label: 'relates to' } ];

    return (
      <Modal { ...this.props } onHide={ this.cancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>链接问题</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel><span className='txt-impt'>*</span>此问题</ControlLabel>
            <Select 
              simpleValue 
              clearable={ false } 
              searchable={ false } 
              disabled={ loading } 
              options={ relationOptions } 
              value={ this.state.relation } 
              onChange={ (newValue) => { this.setState({ relation: newValue }) } } 
              placeholder='请选择关系'/>
          </FormGroup>
          <FormGroup controlId='formControlsSelect'>
            <ControlLabel><span className='txt-impt'>*</span>问题</ControlLabel>
            <Select.Async 
              clearable={ false } 
              disabled={ loading } 
              options={ [] } 
              value={ this.state.dest } 
              onChange={ (newValue) => { this.setState({ dest: newValue }) } } 
              valueKey='id' 
              labelKey='name' 
              loadOptions={ this.searchIssue.bind(this) } 
              placeholder='输入问题号或名称'/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || !this.state.relation || !this.state.dest } onClick={ this.confirm }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
