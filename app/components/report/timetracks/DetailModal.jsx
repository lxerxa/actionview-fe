import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { ttFormat } from '../../share/Funcs'

const moment = require('moment');
const img = require('../../../assets/images/loading.gif');

export default class DetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = { showAll: false };
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    index: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  componentWillMount() {
    const { issue, index } = this.props;
    index(issue.id);
  }

  refresh() {
    const { issue, index } = this.props;
    index(issue.id);
  }

  render() {
    const { data, issue, loading, options:{ w2d=5, d2h=8 } } = this.props;

    const w2m = w2d * d2h * 60;
    const d2m = d2h * 60;

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>工作日志 - { issue.no }</Modal.Title>
        </Modal.Header>
        { loading &&
        <Modal.Body style={ { height: '580px', overflow: 'auto' } }>
          <div style={ { textAlign: 'center', marginTop: '250px' } }>
            <img src={ img } className='loading'/>
          </div>
        </Modal.Body> }
        { !loading &&
        <Modal.Body style={ { height: '580px', overflow: 'auto' } }>
          <div style={ { marginBottom: '10px' } }>
            <span>共耗费 <strong>{ ttFormat(_.reduce(data, (sum, v) => { return sum + (v.spend_m || 0) }, 0), w2m, d2m) }</strong> 分钟</span>
            <span title='刷新'><Button bsStyle='link' onClick={ this.refresh.bind(this) }><i className='fa fa-refresh'></i></Button></span>
          </div>
          <Table condensed responsive>
            <thead>
              <th>人员</th>
              <th>开始时间</th>
              <th>耗费时间</th>
              <th>备注</th>
            </thead>
            <tbody>
            { _.map(data, (v, key) => {
              return (
                <tr key={ key }>
                  <td>{ v.recorder.name || '-' }</td>
                  <td>{ v.started_at ? moment.unix(v.started_at).format('YY/MM/DD HH:mm:ss') : '-' }</td>
                  <td>{ v.spend || '-' }</td>
                  <td width='45%' dangerouslySetInnerHTML={ { __html: v.comments.replace(/(\r\n)|(\n)/g, '<br/>') || '-' } }/>
                </tr>); }) }
            </tbody>
          </Table>
        </Modal.Body> }
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

