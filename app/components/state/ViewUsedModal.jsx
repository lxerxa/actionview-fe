import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class ViewUsedModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    view: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired
  }

  componentWillMount() {
    const { view, data } = this.props;
    view(data.key || data.id);
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { projects, data, loading } = this.props;

    return (
      <Modal show bsSize='large' onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '查看项目应用 - ' + data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          { loading &&
          <div style={ { marginTop: '150px', textAlign: 'center' } }>
            <img src={ img } className='loading'/>
          </div> }
          { !loading &&
          <div style={ { marginBottom: '10px' } }>
            { projects.length > 0 ?
            <span>共有应用项目 <strong>{ projects.length }</strong> 个</span>
            :
            <span>暂无项目应用</span> }
          </div> }
          { !loading && projects.length > 0 &&
          <Table condensed hover responsive>
            <thead>
              <tr>
                <th>项目名称</th>
                <th>问题个数</th>
                <th>工作流</th>
              </tr>
            </thead>
            <tbody>
            { _.map(projects, (v, key) => {
              return (
                <tr key={ key }>
                  <td>
                    { v.status === 'active' ?
                    <span><Link to={ '/project/' + v.key }>{ v.name }</Link></span>
                    :
                    <span>{ v.name }(已关闭)</span> }
                  </td>
                  <td>
                    { v.status === 'active' ?
                    <span>
                      <Link to={ '/project/' + v.key + '/issue?state=' + (data.key || data.id) }>{ v.issue_count || 0 }</Link>
                    </span>
                    :
                    <span> 
                      { v.issue_count || 0 }
                    </span> }
                  </td>
                  <td>
                    { v.status === 'active' ?
                    <span>
                      <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
                        { _.isEmpty(v.workflows) ? '-' : _.map(v.workflows, (s, i) => <li key={ i }><Link to={ '/project/' + v.key + '/workflow/' + s.id }>{ s.name }</Link></li>) }
                      </ul>
                    </span>
                    :
                    <span>
                      <ul style={ { marginBottom: '0px', paddingLeft: '0px', listStyle: 'none' } }>
                        { _.isEmpty(v.workflows) ? '-' : _.map(v.workflows, (s, i) => <li key={ i }>{ s.name }</li>) }
                      </ul>
                    </span> }
                  </td>
                </tr> ); 
            }) }
            </tbody>
          </Table> }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

