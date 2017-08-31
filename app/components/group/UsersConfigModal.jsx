import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import update from 'react/lib/update';
import Card from '../share/Card';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

export default class UsersConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { users: this.props.data.users || [], ecode: 0 };
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, config, data } = this.props;
    const values = { id: data.id, users: _.map(this.state.users, _.iteratee('id')) };
    const ecode = await config(values);
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
    const { options } = this.props;
    const fids = this.state.addFieldIds.split(',');
    for (let i = 0; i < fids.length; i++)
    {
      const field = _.find(options.fields || [], function(o) { return o.id === fids[i]; });
      this.state.cards.push({ id: field.id, text: field.name });
    }
    this.setState({ cards: this.state.cards, addFieldIds: '', enableAdd: false });
  }

  render() {
    const { cards, strCards, enableAdd } = this.state;
    const { i18n: { errMsg }, loading, options } = this.props;
    //let optionFields = [];
    const allFields = _.map(options.fields || [], function(val) {
      return { label: val.name, value: val.id };
    });

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '用户配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsText'>
              <Col sm={ 6 }>
                <Select 
                  multi
                  simpleValue 
                  options={ _.reject(allFields, function(o) { return _.findIndex(cards, function(o2) { return o2.id === o.value; }) !== -1; }) } 
                  clearable={ false } 
                  value={ this.state.addFieldIds } 
                  onChange={ this.handleChange.bind(this) } 
                  placeholder='选择用户(可多选)'/>
                <Button style={ { float: 'right', marginTop: '15px' } } onClick={ this.add.bind(this) } disabled={ !enableAdd }>添加至界面列表 >> </Button>
              </Col>
              <Col sm={ 6 }>
                { users.length > 0 && <div style={ { marginBottom: '8px' } }>用户列表</div> }
                { users.length > 0 ?
                  users.map((op, i) => {
                    return (
                      <div className='user-item'>
                        { op.name }
                        <span style={ { float: 'right', cursor: 'pointer' } } onClick={ this.deleteUser.bind(this, i) }>
                          <i class="fa fa-remove"></i>
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
