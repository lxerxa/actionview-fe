import React, { PropTypes, Component } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import _ from 'lodash';

const no_avatar = require('../../assets/images/no_avatar.png');

const { API_BASENAME } = process.env;

export default class UserListModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { users } = this.props;

    users.sort((a, b) => a.first_name.localeCompare(b.first_name));

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>成员列表</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          { users.length <= 0 &&
          <div style={ { marginBottom: '10px' } }>
            <span>暂无成员</span>
          </div> }
          { users.length > 0 &&
          <div className='users-grid-view'>
            <div className='grid-view-container'>
              { _.map(users, (v, key) => {
                return (<div key={ key } className='grid-view-item'>
                 <img src={ v.avatar ? API_BASENAME + '/getavatar?fid=' + v.avatar : no_avatar } className='middle-avatar'i/>
                   <div className='grid-view-item-name'>{ v.first_name }</div>
                </div>); }) }
            </div>
          </div> }
        </Modal.Body>
        <Modal.Footer>
          { users.length > 0 &&
            <span style={ { float: 'left', padding: '5px' } }>共有成员 <strong>{ users.length }</strong> 人</span> }
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

