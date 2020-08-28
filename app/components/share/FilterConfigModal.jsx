import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from '../share/Card';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class FilterConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0 };
    const filters = this.props.filters || [];
    const filterNum = filters.length;
    for (let i = 0; i < filterNum; i++) {
      this.state.cards.push({
        id: filters[i].id,
        text: filters[i].name
      });
    }
    this.state.strCards = JSON.stringify(this.state.cards);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    title: PropTypes.string,
    loading: PropTypes.bool,
    config: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, config } = this.props;
    let ecode = 0;
    const values = { sequence: _.map(this.state.cards, _.iteratee('id')) };
    ecode = await config(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('保存完成。', 'success', 2000);
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
    const { i18n: { errMsg }, loading, title } = this.props;

    return (
      <Modal show onHide={ this.cancel.bind(this) } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>{ title ? title : 'Filter management' }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { maxHeight: '420px', overflow: 'auto' } }>
          <Form horizontal>
          { cards.length > 0 && <div style={ { marginBottom: '8px' } }>通过上下拖拽改变过滤器显示顺序。</div> }
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
            }) 
            :
            <p>暂无自定义过滤器。</p>
          }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
