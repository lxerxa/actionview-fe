import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const CreateModal = require('./CreateModal');
const SortCardsModal = require('./SortCardsModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, sortCardsModalShow: false, defaultSetShow: false };
    this.createModalClose = this.createModalClose.bind(this);
    this.sortCardsModalClose = this.sortCardsModalClose.bind(this);
    this.setDefaultValue = this.setDefaultValue.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    sortLoading: PropTypes.bool.isRequired,
    defaultLoading: PropTypes.bool.isRequired,
    setDefault: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired
  }

  async setDefaultValue() {
    const defaultValue = findDOMNode(this.refs.defaultValue).value;
    const { setDefault } = this.props;
    const ecode = await setDefault({ 'defaultValue': defaultValue });
    if (ecode === 0) {
      notify.show('设置完成。', 'success', 2000);
    } else {
      notify.show('设置失败。', 'error', 2000);
    }
    this.setState({ defaultSetShow: false });
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  sortCardsModalClose() {
    this.setState({ sortCardsModalShow: false });
  }

  render() {
    const { i18n, create, setSort, sortLoading, indexLoading, defaultLoading, collection } = this.props;
    const defaultIndex = _.findIndex(collection, { default: true });

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }><i className='fa fa-plus'></i>&nbsp;新建优先级</Button>
          { !indexLoading && <Button className='create-btn' onClick={ () => { this.setState({ sortCardsModalShow: true }); } }><i className='fa fa-pencil'></i>&nbsp;编辑顺序</Button> }
          <div className={ indexLoading ? 'hide' : 'div-default-set' }>
            <span className='default-set'>默认优先级：</span>
            { this.state.defaultSetShow ? 
              <div className='default-set'>
                <div className='edit-field-content'>
                  <FormControl componentClass='select' type='text' ref='defaultValue' disabled={ defaultLoading }>
                    { collection.map( itemOption => <option value={ itemOption.id } key={ itemOption.id } selected={ itemOption.default && true }>{ itemOption.name }</option>) }
                  </FormControl>
                </div>
                <img src={ img } className={ defaultLoading ? 'loading' : 'hide' }/>
                <div className={ defaultLoading ? 'hide' : 'edit-field-content' }>
                  <Button className='edit-ok-button' onClick={ this.setDefaultValue }><i className='fa fa-check'></i></Button>
                  <Button className='edit-ok-button' onClick={ () => { this.setState({ defaultSetShow: false }); } }><i className='fa fa-close'></i></Button>
                </div>
              </div>
              :
              <span className='default-set editable-field'>
                <span>{ collection[defaultIndex] ? collection[defaultIndex].name : '无' }</span>
                <Button className='edit-icon' onClick={ () => { this.setState({ defaultSetShow: true }); } }><i className='fa fa-pencil'></i></Button>
              </span>
            }
          </div>
        </div>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>只能删除没有应用到项目问题中的优先级。</div>
        </div>
        { this.state.createModalShow && 
          <CreateModal 
            show 
            close={ this.createModalClose } 
            create={ create } 
            collection={ collection } 
            i18n={ i18n }/> }
        { this.state.sortCardsModalShow && 
          <SortCardsModal 
            show 
            close={ this.sortCardsModalClose } 
            cards={ collection } 
            setSort={ setSort } 
            sortLoading={ sortLoading } 
            i18n={ i18n }/> }
      </div>
    );
  }
}
