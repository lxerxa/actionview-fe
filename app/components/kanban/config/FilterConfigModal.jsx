import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import { IssueFilterList } from '../../issue/IssueFilterList';

const img = require('../../../assets/images/loading.gif');

export default class FilterConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      touched: {},
      errors: {},
      query: {} 
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    const { data: { query={}, filters=[] }, model, no=-1 } = this.props;
    if (model == 'global') {
      _.forEach(query, (v, k) => {
        this.state.query[k] = v && _.isArray(v) ? v.join(',') : (v || '');
      });
    } else if (model == 'filter' && no >= 0) {
      const filter = _.find(filters, { no: no });
      if (!filter) {
        return;
      }
      this.state.name = filter.name;
      const filterQuery = filter.query; 
      _.forEach(filter.query, (v, k) => {
        this.state.query[k] = v && _.isArray(v) ? v.join(',') : (v || ''); 
      });
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    model: PropTypes.string.isRequired,
    no: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    options: PropTypes.object,
    data: PropTypes.object
  }

  async handleSubmit() {
    const { update, close, data:{ id, filters=[] }, model, no } = this.props;

    const newFilters = _.clone(filters);
    const submitData = this.state.query;

    let ecode = 0;
    if (model == 'global') {
      ecode = await update(_.extend({ query: submitData }, { id }));
    } else if (model == 'filter') {
      if (no >= 0) {
        const index = _.findIndex(filters, { no: no });
        newFilters[index].query = submitData;
        newFilters[index].name = this.state.name;
      } else {
        let no = 0;
        if (filters.length > 0) {
          no = _.max(_.map(filters, (v) => v.no)) + 1;
        }
        newFilters.push({ query: submitData, name: this.state.name, no });
      }
      ecode = await update(_.extend({ filters: newFilters }, { id }));
    }
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  render() {
    const { i18n: { errMsg }, model, no, loading, options } = this.props;

    return (
      <Modal 
        show 
        onHide={ this.handleCancel } 
        backdrop='static' 
        aria-labelledby='contained-modal-title-sm'
        dialogClassName='custom-modal-90'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>{ model == 'global' ? '全局过滤器' : ( no === -1 ? '添加快速过滤器' : '编辑快速过滤器' ) }</Modal.Title>
        </Modal.Header>
        <Form horizontal onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto', paddingBottom: '0px' } }>
          { model === 'filter' &&
          <FormGroup 
            style={ { height: '50px', borderBottom: '1px solid #ddd' } } 
            validationState={ this.state.touched.name && this.state.errors.name && 'error' || null }>
            <Col sm={ 2 } componentClass={ ControlLabel }>
              <span className='txt-impt'>*</span>过滤器名称 
            </Col>
            <Col sm={ 8 }>
              <FormControl
                type='text'
                value={ this.state.name }
                onChange={ (e) => { this.setState({ name: e.target.value }); if (!e.target.value) { this.state.errors.name = '必填'; this.setState({ errors: this.state.errors }); } else { this.setState({ errors: {} }); } } }
                onBlur={ (e) => { this.state.touched.name = true; this.setState({ touched: this.state.touched }); } }
                placeholder={ '输入名称' } />
            </Col>
            <Col sm={ 2 } componentClass={ ControlLabel } style={ { textAlign: 'left' } }>
              { this.state.touched.name && (this.state.errors.name || '') }
            </Col>
          </FormGroup> }
          <IssueFilterList
            visable
            styles={ { marginTop: model == 'global' ? '0px' : '10px' } }
            values={ this.state.query }
            textInputChange={ true }
            onChange={ (newValue) => { this.setState({ query: newValue }) } }
            columns={ 2 }
            notShowFields={ [ 'title', 'resolved_at', 'closed_at', 'resolver', 'closer', 'watcher' ] }
            notShowBlocks={ [ 'agile' ] }
            options={ options }/>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ (model === 'filter' && (!this.state.name || _.isEmpty(this.state.query))) || loading } onClick={ this.handleSubmit }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
