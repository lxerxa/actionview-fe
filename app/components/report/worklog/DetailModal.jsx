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
    showedUser: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    issue: PropTypes.object.isRequired,
    index: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  componentWillMount() {
    const { showedUser, issue, index, query } = this.props;
    index(issue.id, _.assign({}, query, { recorder: showedUser.id }));
  }

  refresh() {
    const { showedUser, issue, index, query } = this.props;
    index(issue.id, _.assign({}, query, { recorder: showedUser.id }));
  }

  render() {
    const { data: { total=[], parts=[] }, issue, loading, options: { w2d=5, d2h=8 } } = this.props;

    const w2m = w2d * d2h * 60;
    const d2m = d2h * 60;

    const worklogs = this.state.showAll ? total : parts;
    
    return (
      <Modal show onHide={ this.handleCancel } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>Work log - { issue.no }</Modal.Title>
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
            <span>Total耗费 <strong>{ ttFormat(_.reduce(worklogs, (sum, v) => { return sum + (v.spend_m || 0) }, 0), w2m, d2m) }</strong> 分钟</span>
            <span title='Refresh'><Button bsStyle='link' onClick={ this.refresh.bind(this) }><i className='fa fa-refresh'></i></Button></span>
          </div>
          <Table condensed responsive>
            <thead><tr>
              <th>Member</th>
              <th>Start date</th>
              <th>Spent time</th>
              <th>Comments</th>
            </tr></thead>
            <tbody>
            { _.map(worklogs, (v, key) => {
              return (
                <tr key={ key } style={ { backgroundColor: _.findIndex(parts, { id: v.id }) === -1 && '#e5e5e5' } }>
                  <td>{ v.recorder.name || '-' }</td>
                  <td>{ v.started_at ? moment.unix(v.started_at).format('YY/MM/DD HH:mm:ss') : '-' }</td>
                  <td>{ v.spend || '-' }</td>
                  <td width='45%' dangerouslySetInnerHTML={ { __html: _.escape(v.comments).replace(/(\r\n)|(\n)/g, '<br/>') || '-' } }/>
                </tr>); }) }
            </tbody>
          </Table>
        </Modal.Body> }
        <Modal.Footer>
          <Checkbox
            checked={ this.state.showAll }
            onClick={ () => { this.setState({ showAll: !this.state.showAll }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            显示该问题全部工作日志 
          </Checkbox>
          <Button onClick={ this.handleCancel }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

