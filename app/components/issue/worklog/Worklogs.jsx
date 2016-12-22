import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Panel, Label } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');
const moment = require('moment');

export default class Worklogs extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
  }

  static propTypes = {
    indexLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    indexWorklog: PropTypes.func.isRequired,
    addWorklog: PropTypes.func.isRequired,
    editWorklog: PropTypes.func.isRequired,
    delWorklog: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexLoading) {
      this.setState({ addWorklogShow: false, contents: '' });
    }
  }

  render() {
    const { indexWorklog, collection, indexLoading, loading, itemLoading, delWorklog, editWorklog } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={ 12 } className={ indexLoading && 'hide' } style={ { marginTop: '10px', marginBottom: '10px' } }>
            <div>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ () => { indexWorklog() } }><i className='fa fa-refresh'></i> 刷新</span>
              <span className='comments-button' style={ { marginRight: '10px', float: 'right' } } disabled={ loading } onClick={ this.showWorklogInputor.bind(this) }><i className='fa fa-comment-o'></i> 添加</span>
            </div>
          </Col>
          <Col sm={ 12 }>
          { indexLoading && <div style={ { width: '100%', textAlign: 'center', marginTop: '15px' } }><img src={ img } className='loading' /></div> }
          { collection.length <= 0 && !indexLoading ?
            <div style={ { width: '100%', textAlign: 'left', marginTop: '10px', marginLeft: '10px' } }>暂无备注。</div>
            :
            _.map(collection, (val, i) => {
              const header = ( <div style={ { fontSize: '12px' } }>
                <span dangerouslySetInnerHTML= { { __html: '<a title="' + (val.creator && val.creator.nameAndEmail || '') + '">' + (val.creator && val.creator.name || '') + '</a> 添加了工作日志 - ' + (val.created_at && moment.unix(val.created_at).format('YY/MM/DD HH:mm:ss')) + (val.edited_flag == 1 ? '<span style="color:red"> - 已编辑</span>' : '') } } />
                <span className='comments-button comments-edit-button' style={ { float: 'right' } } onClick={ this.showDelWorklog.bind(this, val) }><i className='fa fa-trash' title='删除'></i></span>
                <span className='comments-button comments-edit-button' style={ { marginRight: '10px', float: 'right' } } onClick={ this.showEditWorklog.bind(this, val) }><i className='fa fa-pencil' title='编辑'></i></span>
              </div> ); 
              let comments = val.comments || '-';
              comments = comments.replace(/(\r\n)|(\n)/g, '<br/>'); 

              return (
                <Panel header={ header } key={ i } style={ { margin: '5px' } }>
                  <span style={ { lineHeight: '24px' } } dangerouslySetInnerHTML={ { __html: contents } }/>
                </Panel>) } ) }
          </Col>
        </FormGroup>
        { this.state.addWorklogShow &&
          <AddWorklogModal show
            close={ () => { this.setState({ addWorklogShow: false }) } }
            data={ this.state.selectedWorklog }
            loading = { itemLoading }
            add={ addWorklog }/> }
        { this.state.editWorklogShow &&
          <EditWorklogModal show
            close={ () => { this.setState({ editWorklogShow: false }) } }
            data={ this.state.selectedWorklog }
            loading = { itemLoading }
            edit={ editWorklog }/> }
        { this.state.delWorklogShow &&
          <DelWorklogModal show
            close={ () => { this.setState({ delWorklogShow: false }) } }
            data={ this.state.selectedWorklog }
            loading = { itemLoading }
            del={ delWorklog }/> }
      </Form>
    );
  }
}
