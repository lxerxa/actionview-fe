import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import update from 'react/lib/update';
import Card from '../share/Card';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import ApiClient from '../../../shared/api-client';

const img = require('../../assets/images/loading.gif');

export default class UsersConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      addUsers: [], 
      users: this.props.data.users ? _.clone(this.props.data.users) : [], 
      ecode: 0 };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, config, data } = this.props;
    const values = { id: data.id, users: _.map(this.state.users, _.iteratee('id')) };
    const ecode = await config(values.id, values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('配置完成。', 'success', 2000);
    } else {
      this.setState({ ecode: ecode });
    }
  }

  cancel() {
    const { close, loading } = this.props;
    if (loading) {
      return;
    }
    close();
  }

  deleteUser(i) {
    this.state.users.splice(i, 1);
    this.setState({ users: this.state.users });
  }

  add() {
    const { addUsers } = this.state;
    _.map(addUsers, (v) => {
      if (_.findIndex(this.state.users, { id: v.id }) > 0) {
        return;
      }
      this.state.users.unshift({ id: v.id, name: v.nameAndEmail });
    });
    this.setState({ users: this.state.users, addUsers: [], enableAdd: false });
  }

  handleChange(users) {
    if (users.length > 0) {
      this.setState({ addUsers: users, enableAdd: true });
    } else {
      this.setState({ addUsrs: [], enableAdd: false });
    }
  }

  async searchUsers(input) {
    input = input.toLowerCase();
    if (!input) {
      return { options: [] };
    }
    const api = new ApiClient;
    const results = await api.request( { url: '/user/search?s=' + input } );
    return { options: _.map(results.data, (val) => { val.nameAndEmail = val.name + '(' + val.email + ')'; return val; }) };
  }

  handleUserSelectChange(value) {
    this.setState({ addUsers: value });
  }

  render() {
    const { users, addUsers } = this.state;
    const { i18n: { errMsg }, loading } = this.props;

    _.map(users, (v, i) => {
      if (!v.name) {
        users[i].name = v.first_name + '(' + v.email + ')';
      }
    });

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '用户配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsText'>
              <Col sm={ 6 }>
                <Select.Async
                  multi
                  clearable={ false }
                  options={ [] }
                  value={ addUsers }
                  onChange={ this.handleUserSelectChange.bind(this) }
                  valueKey='id'
                  labelKey='nameAndEmail'
                  loadOptions={ this.searchUsers }
                  placeholder='请输入用户'/>
                <Button style={ { float: 'right', marginTop: '15px' } } onClick={ this.add.bind(this) }>添加至用户列表 >> </Button>
              </Col>
              <Col sm={ 6 }>
                { users.length > 0 && <div style={ { marginBottom: '8px' } }>用户列表 - { users.length }</div> }
                { users.length > 0 ?
                  users.map((op, i) => {
                    return (
                      <div className='user-item' key={ i }>
                        { op.name }
                        <span style={ { float: 'right', cursor: 'pointer' } } onClick={ this.deleteUser.bind(this, i) }>
                          <i className='fa fa-remove'></i>
                        </span>
                      </div>
                    );
                  }) 
                  :
                  <p>用户列表为空。</p>
                }  
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading } onClick={ this.save.bind(this) }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
