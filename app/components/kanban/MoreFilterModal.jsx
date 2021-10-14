import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';
import { IssueFilterList } from '../issue/IssueFilterList';

const img = require('../../assets/images/loading.gif');

export default class MoreFilterModal extends Component {
  constructor(props) {
    super(props);

    this.state = { query: {}, oldQuery: {} };

    const { query } = props;
    _.forEach(query, (v, k) => {
      this.state.query[k] = v && _.isArray(v) ? v.join(',') : (v || '');
      this.state.oldQuery[k] = v && _.isArray(v) ? v.join(',') : (v || '');
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    search: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  handleSubmit() {
    const { search, close } = this.props;
    const { query } = this.state;
    search(query);
    close();
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { options } = this.props;
    const { query, oldQuery } = this.state;

    return (
      <Modal 
        show 
        onHide={ this.handleCancel } 
        backdrop='static' 
        aria-labelledby='contained-modal-title-sm' 
        dialogClassName='custom-modal-90'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>更多过滤</Modal.Title>
        </Modal.Header>
        <Form horizontal onKeyUp={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } }>
        <Modal.Body style={ { maxHeight: '580px', overflow: 'auto', paddingBottom: '0px' } }>
          <IssueFilterList
            visable
            values={ this.state.query }
            styles={ { marginTop: '0px' } }
            textInputChange={ true }
            onChange={ (newValue) => { this.setState({ query: newValue }) } }
            columns={ 2 }
            notShowFields={ [ 'title', 'resolved_at', 'closed_at', 'resolver', 'closer', 'watcher' ] }
            notShowBlocks={ [ 'agile' ] }
            options={ options }/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleSubmit } disabled={ _.isEqual(oldQuery, query) }>确定</Button>
          <Button bsStyle='link' onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
