import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Card from './EditCard';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class OptionValuesConfigModal extends Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.state = { cards: [], editingCards: [], ecode: 0, enableAdd: false, addErr: false };
    const optionValues = this.props.data.optionValues || [];
    const optionNum = optionValues.length;
    for (let i = 0; i < optionNum; i++) {
      this.state.cards.push({
        id: optionValues[i].id,
        old_text: optionValues[i].name,
        text: optionValues[i].name
      });
    }
    this.state.strCards = JSON.stringify(this.state.cards);
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
    let ecode = 0;
    const values = { id: data.id, optionValues: _.map(this.state.cards, (val) => { return { id: val.id, name: val.text } }) };
    ecode = await config(values);
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

  sort() {
    const cards = this.state.cards;
    this.setState(cards.sort(function(a, b) { return a.text.localeCompare(b.text); } ));
  }

  addEditingCards(id) {
    this.state.editingCards.push(id);
    this.setState({ editingCards: this.state.editingCards });
  }

  undoCard(i) {
    if (this.state.cards[i] && this.state.cards[i].old_text) {
      const index = _.findIndex(this.state.cards, { text: this.state.cards[i].old_text });
      if (index === i || index === -1) {
        this.state.cards[i].text = this.state.cards[i].old_text;
        this.setState({ cards: this.state.cards });
      } else {
        notify.show('重置失败，可选值可能重复。', 'error', 2000);
      }
    }
  }

  editCard(i, id, newText) {
    newText = _.trim(newText);
    const index = _.findIndex(this.state.cards, { text: newText });
    if (index === -1 || this.state.cards[index].id === id) {
      this.state.editingCards = _.reject(this.state.editingCards, (v) => v === id);
      if (newText) {
        this.state.cards[i].text = newText;
      } else {
        this.state.cards.splice(i, 1);
      }
      this.setState({ cards: this.state.cards, editingCards: this.state.editingCards });
      return true;
    } else {
      return false;
    }
  }

  deleteCard(i) {
    this.state.cards.splice(i, 1);
    this.setState({ cards: this.state.cards });
  }

  handleChange(e) {
    this.setState({ addErr: false });
    const optionValue = _.trim(e.target.value);
    if (optionValue === '') {
      this.setState({ enableAdd: false });
    } else if (_.findIndex(this.state.cards, (o) => o.text === optionValue) !== -1) {
      this.setState({ enableAdd: false });
    }else {
      this.setState({ enableAdd: true });
    }
  }

  add() {
    const optionValue = _.trim(findDOMNode(this.refs.addOpt).value);
    if (optionValue && this.state.enableAdd) {
      this.state.cards.push({ id: optionValue, text: optionValue });
      this.setState({ cards: this.state.cards });
      findDOMNode(this.refs.addOpt).value = '';
      this.setState({ enableAdd: false });
    } else {
      this.setState({ addErr: true });
    }
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
    const { cards, editingCards, strCards, enableAdd } = this.state;
    const { i18n: { errMsg }, loading } = this.props;

    return (
      <Modal show onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '字段可选值配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsText' validationState={ this.state.addErr ? 'error' : null }>
              <Col sm={ 12 }>
                <FormControl 
                  type='text' 
                  ref='addOpt' 
                  placeholder='输入可选值，回车即可添加'
                  onChange={ this.handleChange.bind(this) } 
                  onKeyDown={ (e) => { if (e.keyCode == '13') { e.preventDefault(); this.add(); } } }/>
              </Col>
              {/* <Col sm={ 1 }>
                <Button bsStyle='link' style={ { marginLeft: '-25px' } } onClick={ this.add.bind(this) } disabled={ !enableAdd }>添加</Button>
              </Col> */}
            </FormGroup>
          </Form>
          { cards.length > 0 && <div>通过上下拖拽改变显示顺序。<Button bsStyle='link' onClick={ this.sort.bind(this) }>按字母排序</Button></div> }
          { cards.length > 0 ?
            cards.map((op, i) => {
              return (
                <Card 
                  key={ op.id }
                  all={ this.state.cards }
                  index={ i }
                  id={ op.id }
                  text={ op.text }
                  isEdited={ op.old_text && op.text !== op.old_text }
                  addEditingCards={ this.addEditingCards.bind(this) }
                  move={ this.moveCard.bind(this) }
                  undo={ this.undoCard.bind(this) }
                  edit={ this.editCard.bind(this) }
                  del={ this.deleteCard.bind(this, i) }/>
              );
            }) :
            <p>可选值列表为空</p>
          }
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ !_.isEmpty(editingCards) || loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
