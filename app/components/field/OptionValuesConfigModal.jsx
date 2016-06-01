import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from './Card';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class OptionValuesConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0 };
    const optionValues = this.props.data.optionValues || [];
    const optionNum = optionValues.length;
    for (let i = 0; i < optionNum; i++) {
      this.state.cards.push({
        id: optionValues[i],
        text: optionValues[i]
      });
    }
    this.state.strCards = JSON.stringify(this.state.cards);
  }

  static propTypes = {
    loading: PropTypes.bool,
    config: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, config, data } = this.props;
    let ecode = 0;
    const values = { id: data.id, optionValues: _.map(this.state.cards, _.iteratee('text')) };
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

  sort() {
    const cards = this.state.cards;
    this.setState(cards.sort(function(a, b) { return a.text.localeCompare(b.text); } ));
  }

  deleteCard(i) {
    this.state.cards.splice(i, 1);
    this.setState({ cards: this.state.cards });
  }

  add() {
    const optionValue = findDOMNode(this.refs.addOpt).value;
    if (optionValue.trim() === '') {
      return;
    }
    this.state.cards.push({ id: optionValue, text: optionValue });
    this.setState({ cards: this.state.cards });
    findDOMNode(this.refs.addOpt).value = '';
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
    const { cards, strCards } = this.state;
    const { loading } = this.props;

    return (
      <Modal { ...this.props } onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-la'>{ '字段可选值配置 - ' + this.props.data.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { cards.length > 0 && <p>通过上下拖拽改变显示顺序。<Button bsStyle='link' onClick={ this.sort.bind(this) }>按字母排序</Button></p> }
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
            <p>可选值为空</p>
          }
          <FormGroup controlId='formControlsText' style={ { marginTop: '15px' } }>
            <FormControl type='text' ref='addOpt' placeholder='' style={ { display: 'inline-block', width: '60%' } }/>
            <Button className='ralign' onClick={ this.add.bind(this) } style={ { display: 'inline-block', marginLeft: '10px' } }>添加新值</Button>
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
