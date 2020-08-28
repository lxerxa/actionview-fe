import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import update from 'react/lib/update';
import Card from '../../share/Card';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../../assets/images/loading.gif');

export default class DisplayFieldsConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0, addFieldIds: '', enableAdd: false };

    const { data: { display_fields=[] }, options: { fields=[] } } = this.props;
    _.forEach(display_fields, (v) => {
      const index = _.findIndex(fields, { key: v });
      if (index === -1) {
        return;
      }
      this.state.cards.push({
        id: v,
        text: fields[index].name || ''
      });
    });
    this.state.strCards = JSON.stringify(this.state.cards);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    update: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, update, data } = this.props;

    const values = _.map(this.state.cards, (v) => v.id);
    const ecode = await update({ display_fields: values, id: data.id });
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('Setup complete', 'success', 2000);
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
      this.setState({ addFieldIds: fields, enableAdd: true });
    } else {
      this.setState({ addFieldIds:'', enableAdd: false });
    }
  }

  add() {
    const { options: { fields=[] } } = this.props;

    const fids = this.state.addFieldIds.split(',');
    for (let i = 0; i < fids.length; i++) {
      const field = _.find(fields || [], function(o) { return o.key === fids[i]; });
      this.state.cards.push({ id: field.key, text: field.name });
    }
    this.setState({ cards: this.state.cards, addFieldIds: '', enableAdd: false });
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const { cards, strCards, enableAdd } = this.state;
    const { i18n: { errMsg }, loading, options } = this.props;

    const fields = _.reject(options.fields, (v) => v.type === 'File' || v.type === 'TextArea' || [ 'type', 'title', 'resolve_version', 'epic', 'sprints' ].indexOf(v.key) !== -1);
    const newFields = _.map(fields, (v) => { return { value: v.key, label: v.name } });

    return (
      <Modal show onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>显示字段配置</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsText'>
              <Col sm={ 6 }>
                <Select 
                  simpleValue 
                  options={ _.reject(newFields, function(v) { return _.findIndex(cards, function(v2) { return v2.id === v.value; }) !== -1; }) } 
                  clearable={ false } 
                  value={ this.state.addFieldIds } 
                  onChange={ this.handleChange.bind(this) } 
                  placeholder='Select a field to add (multiple choices)'
                  multi/>
                <Button 
                  style={ { float: 'right', marginTop: '15px' } } 
                  onClick={ this.add.bind(this) } 
                  disabled={ !enableAdd }>添加至列表 >> 
                </Button>
              </Col>
              <Col sm={ 6 }>
                { cards.length > 0 && <div style={ { marginBottom: '8px' } }>Drag up and down to change the display order.</div> }
                { cards.length > 0 ?
                  cards.map((op, i) => {
                    return (
                      <Card 
                        key={ op.id }
                        index={ i }
                        id={ op.id }
                        text={ op.text }
                        moveCard={ this.moveCard }
                        deleteCard={ this.deleteCard.bind(this, i) }/>
                    );
                  }) 
                  :
                  <p>显示字段为空。</p>
                }  
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='link' style={ { float: 'left' } } disabled={ loading } onClick={ () => { this.setState({ cards: [] }) } }>清空字段</Button>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
