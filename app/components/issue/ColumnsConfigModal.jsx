import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from './ColumnCard';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { BaseColumnFields } from '../share/Constants';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class ColumnsConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0, addFieldIds: '', enableAdd: false };
    const fields = this.props.data || [];
    _.forEach(fields, (v) => {
      const index = _.findIndex(props.options.fields || [], { key: v.key });
      if (index === -1) {
        return;
      }
      this.state.cards.push({
        id: v.key,
        width: v.wdith || '100',
        text: props.options.fields[index].name || ''
      });
    });
    this.state.strCards = JSON.stringify(this.state.cards);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    set: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
  }

  async save() {
    const { close, set, data } = this.props;
    const values = _.map(this.state.cards, (v) => { return { key: v.id, width: v.width || '100' } });
    const ecode = await set(values);
    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
      notify.show('设置完成。', 'success', 2000);
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

  editWidth(i, width) {
    if (this.state.cards[i]) {
      this.state.cards[i].width = width;
      this.setState({ cards: this.state.cards });
    }
  }


  handleChange(fields) {
    if (fields !== '') {
      this.setState({ addFieldIds: fields, enableAdd: true });
    } else {
      this.setState({ addFieldIds:'', enableAdd: false });
    }
  }

  add() {
    const { options } = this.props;

    const fields = _.clone(BaseColumnFields);
    _.forEach(options.fields || [], (v) => {
      const index = _.findIndex(fields, { key: v.key });
      if (index === -1) {
        fields.push({ key: v.key, name: v.name });
      }
    });

    const fids = this.state.addFieldIds.split(',');
    for (let i = 0; i < fids.length; i++) {
      const field = _.find(fields || [], function(o) { return o.key === fids[i]; });
      this.state.cards.push({ id: field.key, text: field.name, width: '100' });
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

    const fields = _.clone(BaseColumnFields);
    _.forEach(options.fields || [], (v) => {
      if (v.type === 'File' || v.key === 'title' || v.key === 'labels') {
        return;
      }
      const index = _.findIndex(fields, { key: v.key });
      if (index === -1) {
        fields.push({ key: v.key, name: v.name });
      }
    });
    const newFields = _.map(fields, (v) => { return { value: v.key, label: v.name } });

    return (
      <Modal show onHide={ this.cancel.bind(this) } bsSize='large' backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>显示列配置</Modal.Title>
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
                  placeholder='选择添加字段(可多选)' 
                  multi/>
                <Button 
                  style={ { float: 'right', marginTop: '15px' } } 
                  onClick={ this.add.bind(this) } 
                  disabled={ !enableAdd }>添加至列表 >> 
                </Button>
                <div style={ { float: 'right', marginTop: '15px' } }>
                  注意：除问题列表的前三列（编号、类型和主题）外，其它列支持动态配置。
                </div>
              </Col>
              <Col sm={ 6 }>
                { cards.length > 0 && <div style={ { marginBottom: '8px' } }>通过上下拖拽改变显示顺序。</div> }
                { cards.length > 0 ?
                  cards.map((op, i) => {
                    return (
                      <Card 
                        key={ op.id }
                        index={ i }
                        id={ op.id }
                        text={ op.text }
                        width={ op.width }
                        moveCard={ this.moveCard }
                        editWidth={ this.editWidth.bind(this) }
                        deleteCard={ this.deleteCard.bind(this, i) }/>
                    );
                  }) 
                  :
                  <p>界面列表为空。</p>
                }  
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Button disabled={ loading || strCards == JSON.stringify(cards) } onClick={ this.save.bind(this) }>确定</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
