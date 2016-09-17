import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'lodash';

import Tabs, { TabPane } from 'rc-tabs';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';
import Card from '../share/Card';

const img = require('../../assets/images/loading.gif');

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = '必填';
  }

  return errors;
};

@reduxForm({
  form: 'screen',
  fields: [ 'name', 'description' ],
  validate
})
@DragDropContext(HTML5Backend)
export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, activeKey: '1', cards: [], addFieldIds: '', enableAdd: false, cards2: [], addFieldIds2: '', enableAdd2: false, removeIconShow: false, hoverId: '' };
    this.moveCard = this.moveCard.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.object,
    options: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { values, create, close } = this.props;
    const ecode = await create(
      _.assign(values, 
        { fields: _.map(this.state.cards, _.iteratee('id')) },
        { required_fields: _.map(this.state.cards2, _.iteratee('id')) }
      )
    );

    if (ecode === 0) {
      this.setState({ ecode: 0 });
      close();
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { close, submitting } = this.props;
    if (submitting) {
      return;
    }
    this.setState({ ecode: 0 });
    close();
  }

  deleteCard(i) {
    const cardId = this.state.cards[i].id;

    this.state.cards.splice(i, 1);
    this.setState({ cards: this.state.cards });

    const ind = _.findIndex(this.state.cards2, { id: cardId });
    if (ind !== -1) {
      this.state.cards2.splice(ind, 1);
      this.setState({ cards2: this.state.cards2 });
    }
  }

  handleChange(fields) {
    if (fields !== '') {
      this.setState ({ addFieldIds: fields, enableAdd: true });
    } else {
      this.setState ({ enableAdd: false });
    }
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

  deleteCard2(i) {
    this.state.cards2.splice(i, 1);
    this.setState({ cards2: this.state.cards2 });
  }

  handleChange2(fields) {
    if (fields !== '') {
      this.setState ({ addFieldIds2: fields, enableAdd2: true });
    } else {
      this.setState ({ enableAdd2: false });
    }
  }

  add2() {
    const fids = this.state.addFieldIds2.split(',');
    for (let i = 0; i < fids.length; i++)
    {
      const field = _.find(this.state.cards || [], function(o) { return o.id === fids[i]; });
      this.state.cards2.push({ id: field.id, name: field.text });
    }
    this.setState({ cards2: this.state.cards2, addFieldIds2: '', enableAdd2: false });
  }

  onTabClick(key) {
    if (key === this.state.activeKey)
    {
      this.setState({ activeKey: '' });
    }
  }

  onTabChange(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const { fields: { name, description }, handleSubmit, invalid, submitting, options } = this.props;

    const { cards, enableAdd, cards2, enableAdd2 } = this.state;
    const allFields = _.map(options.fields || [], function(val) {
      return { label: val.name, value: val.id };
    });

    const screenFields = _.map(cards || [], function(val) {
      return { label: val.text, value: val.id };
    });

    return (
      <Modal { ...this.props } onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>新建界面</Modal.Title>
        </Modal.Header>
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
        <Modal.Body className={ submitting ? 'disable' : 'enable' } style={ { height: '450px', overflow: 'auto' } }>
          <Tabs
            activeKey={ this.state.activeKey }
            onTabClick={ this.onTabClick.bind(this) } 
            onChange={ this.onTabChange.bind(this) } >
            <TabPane tab='基本' key='1'>
              <div style={ { paddingTop: '15px' } }>
                <FormGroup controlId='formControlsText' validationState={ name.touched && name.error ? 'error' : '' }>
                  <ControlLabel><span className='txt-impt'>*</span>界面名</ControlLabel>
                  <FormControl type='text' { ...name } placeholder='界面名'/>
                  { name.touched && name.error && <HelpBlock style={ { float: 'right' } }>{ name.error }</HelpBlock> }
                </FormGroup>
                <FormGroup controlId='formControlsText'>
                  <ControlLabel>描述</ControlLabel>
                  <FormControl type='text' { ...description } placeholder='描述内容'/>
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='字段配置' key='2'>
              <div style={ { paddingTop: '15px' } }>
                { cards.length > 0 && <p>通过上下拖拽改变显示顺序。</p> }
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
                  <p>此界面暂无字段。</p>
                }
                <FormGroup controlId='formControlsText' style={ { marginTop: '15px' } }>
                  <div style={ { display: 'inline-block', width: '68%' } }>
                    <Select simpleValue options={ _.reject(allFields, function(o) { return _.findIndex(cards, function(o2) { return o2.id === o.value; }) !== -1; }) } clearable={ false } value={ this.state.addFieldIds } onChange={ this.handleChange.bind(this) } placeholder='请选择添加字段(可多选)' multi/>
                  </div>
                  <Button onClick={ this.add.bind(this) } disabled={ !enableAdd } style={ { display: 'inline-block', margin: '3px 0 0 10px', position: 'absolute' } }>添加字段</Button>
                </FormGroup>
              </div>
            </TabPane>
            <TabPane tab='必填字段' key='3'>
              <div style={ { paddingTop: '15px' } }>
                { cards2.length > 0 ? <p>以下为页面的必填字段</p> : <p>此页面没有必填字段</p> }
                { cards2.length > 0 && 
                  <ul onMouseLeave={ () => { this.setState({ removeIconShow: false }) } } onMouseOver={ () => { this.setState({ removeIconShow: true }) } } className='list-unstyled clearfix'>
                    { 
                      cards2.map((op, i) => {
                        return (
                          <li key={ op.id } style={ { width: '68%', borderBottom: '1px gray dashed', padding: '5px 0 5px 0' } } onMouseOver={ () => { this.setState({ hoverId: op.id }) } }>
                            <b>{ op.name }</b>
                            { this.state.hoverId === op.id && this.state.removeIconShow &&
                              <span style={ { float: 'right', marginLeft:'15px', cursor: 'pointer', marginRight: '5px' } } onClick={ this.deleteCard2.bind(this, i) }>
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
                    <Select simpleValue options={ _.reject(screenFields, function(o) { return _.findIndex(cards2, function(o2) { return o2.id === o.value; }) !== -1; }) } clearable={ false } value={ this.state.addFieldIds2 } onChange={ this.handleChange2.bind(this) } placeholder='请选择必填字段(可多选)' multi/>
                  </div>
                  <Button onClick={ this.add2.bind(this) } disabled={ !enableAdd2 } style={ { display: 'inline-block', margin: '3px 0 0 10px', position: 'absolute' } }>添加字段</Button>
                </FormGroup>
              </div>
            </TabPane>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <span className='ralign'>{ this.state.ecode !== 0 && !submitting && 'aaaa' }</span>
          <image src={ img } className={ submitting ? 'loading' : 'hide' }/>
          <Button className='ralign' disabled={ submitting || invalid } type='submit'>确定</Button>
          <Button disabled={ submitting } onClick={ this.handleCancel }>取消</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
