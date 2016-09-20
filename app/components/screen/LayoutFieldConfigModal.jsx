import React, { PropTypes, Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class LayoutFieldConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = { cards: [], ecode: 0, addFieldIds: '', enableAdd: false };
    const fields = this.props.data.fields || [];
    const fieldNum = fields.length;
    for (let i = 0; i < fieldNum; i++) {
      if (fields[i].required) {
        this.state.cards.push({
          id: fields[i].id,
          name: fields[i].name
        });
      }
    }
    this.state.strCards = JSON.stringify(this.state.cards);
  }

  static propTypes = {
    loading: PropTypes.bool,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, config, data } = this.props;
    let ecode = 0;
    const values = { id: data.id, required_fields: _.map(this.state.cards, _.iteratee('id')) };
    ecode = await config(values);

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
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

  deleteCard(i) {
    this.state.cards.splice(i, 1);
    this.setState({ cards: this.state.cards });
  }

  handleChange(fields) {
    if (fields !== '') {
      this.setState ({ addFieldIds: fields, enableAdd: true });
    } else {
      this.setState ({ enableAdd: false });
    }
  }

  add() {
    const { data } = this.props;
    const fids = this.state.addFieldIds.split(',');
    for (let i = 0; i < fids.length; i++)
    {
      const field = _.find(data.fields || [], function(o) { return o.id === fids[i]; });
      this.state.cards.push({ id: field.id, name: field.name });
    }
    this.setState({ cards: this.state.cards, addFieldIds: '', enableAdd: false });
  }

  render() {
    const { cards, strCards, enableAdd } = this.state;
    const { loading, data } = this.props;

    const screenFields = _.map(data.fields || [], function(val) {
      return { label: val.name, value: val.id };
    });

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '界面字段配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { cards.length > 0 ? <p>以下为页面的必填字段</p> : <p>此页面没有必填字段</p> }
          { cards.length > 0 && 
            <ul onMouseLeave={ () => { this.setState({ removeIconShow: false }) } } onMouseOver={ () => { this.setState({ removeIconShow: true }) } } className='list-unstyled clearfix'>
              { 
                cards.map((op, i) => {
                  return (
                    <li key={ op.id } style={ { width: '68%', borderBottom: '1px gray dashed', padding: '5px 0 5px 0' } } onMouseOver={ () => { this.setState({ hoverId: op.id }) } }>
                      <b>{ op.name }</b>
                      { this.state.hoverId === op.id && this.state.removeIconShow &&
                        <span style={ { float: 'right', marginLeft:'15px', cursor: 'pointer', marginRight: '5px' } } onClick={ this.deleteCard.bind(this, i) }>
                          <i className='fa fa-remove'></i>
                        </span>
                      }
                    </li>
                  ); 
                }) 
              }
              <li>&nbsp;</li>
            </ul>
          }
          <FormGroup controlId='formControlsText' style={ { marginTop: '15px' } }>
            <div style={ { display: 'inline-block', width: '68%' } }>
              <Select simpleValue options={ _.reject(screenFields, function(o) { return _.findIndex(cards, function(o2) { return o2.id === o.value; }) !== -1; }) } clearable={ false } value={ this.state.addFieldIds } onChange={ this.handleChange.bind(this) } placeholder='请选择必填字段(可多选)' multi/>
            </div>
            <Button onClick={ this.add.bind(this) } disabled={ !enableAdd } style={ { display: 'inline-block', margin: '3px 0 0 10px', position: 'absolute' } }>添加</Button>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && 'aaaa' }</span>
          <image src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>确定</Button>
          <Button disabled={ loading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
