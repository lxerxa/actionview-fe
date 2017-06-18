import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from '../share/Card';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class OptionValuesConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.add = this.add.bind(this);
    this.state = { cards: [], ecode: 0, enableAdd: false };
    const optionValues = this.props.data.optionValues || [];
    const optionNum = optionValues.length;
    for (let i = 0; i < optionNum; i++) {
      this.state.cards.push({
        id: optionValues[i].id,
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
    const values = { id: data.id, optionValues: _.map(this.state.cards, (val) => { return { id: val.text, name: val.text } }) };
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

  deleteCard(i) {
    this.state.cards.splice(i, 1);
    this.setState({ cards: this.state.cards });
  }

  handleChange(e) {
    const optionValue = e.target.value;
    if (optionValue.trim() === '') {
      this.setState({ enableAdd: false });
    } else if (_.findIndex(this.state.cards, function(o) { return o.id === optionValue }) !== -1) {
      this.setState({ enableAdd: false });
    }else {
      this.setState({ enableAdd: true });
    }
  }

  add() {
    const optionValue = findDOMNode(this.refs.addOpt).value;
    this.state.cards.push({ id: optionValue, text: optionValue });
    this.setState({ cards: this.state.cards });
    findDOMNode(this.refs.addOpt).value = '';
    this.setState({ enableAdd: false });
  }

  handlerKeyUp(event) {
    if (event.keyCode === 13) {
      if (!this.state.enableAdd) {
        return false;
      }
      this.add();      
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
    const { cards, strCards, enableAdd } = this.state;
    const { i18n: { errMsg }, loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ '字段可选值配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { height: '420px', overflow: 'auto' } }>
          <Form horizontal>
            <FormGroup controlId='formControlsText'>
              <Col sm={ 11 }>
                <FormControl 
                  type='text' 
                  ref='addOpt' 
                  placeholder='输入可选值'
                  onChange={ this.handleChange.bind(this) } 
                  onKeyDown={ (e) => { if (e.keyCode == 13) { e.preventDefault(); } } } 
                  onKeyUp={ this.handlerKeyUp.bind(this) }/>
              </Col>
              <Col sm={ 1 }>
                <Button bsStyle='link' style={ { marginLeft: '-25px' } } onClick={ this.add.bind(this) } disabled={ !enableAdd }>添加</Button>
              </Col>
            </FormGroup>
          </Form>
          { cards.length > 0 && <div>通过上下拖拽改变显示顺序。<Button bsStyle='link' onClick={ this.sort.bind(this) }>按字母排序</Button></div> }
          { cards.length > 0 ?
            cards.map((op, i) => {
              return (
                <Card key={ op.id }
                  index={ i }
                  id={ op.id }
                  text={ op.text }
                  moveCard={ this.moveCard }
                  deleteCard={ this.deleteCard.bind(this, i) }/>
              );
            }) :
            <p>可选值列表为空</p>
          }
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>确定</Button>
          <Button disabled={ loading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
