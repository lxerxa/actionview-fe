import React, { PropTypes, Component } from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from './ColumnCard';
import Select from 'react-select';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const img = require('../../assets/images/loading.gif');

@DragDropContext(HTML5Backend)
export default class ColumnsConfigModal extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: [], ecode: 0, addFieldIds: '', enableAdd: false, saveForProject: false };

    const { data=[], options:{ fields=[] } } = this.props;
    _.forEach(data, (v) => {
      const index = _.findIndex(fields || [], { key: v.key });
      if (index === -1) {
        return;
      }
      this.state.cards.push({
        id: v.key,
        width: v.width || '100',
        text: fields[index].name || ''
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
    const ecode = await set({ columns: values, save_for_project: this.state.saveForProject });
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
    const { options: { fields=[] } } = this.props;

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

    const fields = _.reject(options.fields || [], (v) => v.type === 'File' || [ 'type', 'reporter', 'created_at', 'title', 'labels' ].indexOf(v.key) !== -1);
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
                  placeholder='Select a field to add (multiple choices)'
                  multi/>
                <Button 
                  style={ { float: 'right', marginTop: '15px' } } 
                  onClick={ this.add.bind(this) } 
                  disabled={ !enableAdd }>添加至列表 >> 
                </Button>
                <div style={ { float: 'right', marginTop: '15px' } }>
                  Warning：<br/>1. 问题列表除前三列（编号、类型和主题）外，其它列支持动态配置。<br/>2. 通过上下拖拽改变列of显示顺序，修改文本框数值(单位：px)调整列of显示宽度。
                </div>
              </Col>
              <Col sm={ 6 }>
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
                  <p>显示列表为空。</p>
                }  
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          { options.permissions && options.permissions.indexOf('manage_project') !== -1 &&
          <Checkbox
            disabled={ loading }
            checked={ this.state.saveForProject }
            onClick={ () => { this.setState({ saveForProject: !this.state.saveForProject }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            保存作为该项目默认显示列
          </Checkbox> }
          <Button disabled={ loading || (strCards == JSON.stringify(cards) && !this.state.saveForProject) } onClick={ this.save.bind(this) }>Submit</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.cancel.bind(this) }>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
