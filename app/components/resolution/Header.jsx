import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const SortCardsModal = require('./SortCardsModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, sortCardsModalShow: false, defaultSetShow: false, defaultSetLoadingShow: false };
    this.createModalClose = this.createModalClose.bind(this);
    this.sortCardsModalClose = this.sortCardsModalClose.bind(this);
    this.setDefaultValue = this.setDefaultValue.bind(this);
  }

  static propTypes = {
    create: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    setDefault: PropTypes.func.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    sortLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  async setDefaultValue() {
    this.setState({ defaultSetLoadingShow: true });

    const defaultValue = findDOMNode(this.refs.defaultValue).value;
    const { setDefault } = this.props;
    const ecode = await setDefault({ 'defaultValue': defaultValue });
    // fix me add tip
    this.setState({ defaultSetShow: false, defaultSetLoadingShow: false });
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  sortCardsModalClose() {
    this.setState({ sortCardsModalShow: false });
  }

  render() {
    const { create, setSort, sortLoading, indexLoading, collection } = this.props;
    const styles = { display: 'inline-block', marginLeft: '15px' };
    const defaultIndex = _.findIndex(collection, { default: true });

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h3>#问题解决结果#</h3>
        </div>
        <div>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建结果</Button>
          { !indexLoading && <Button className='create-btn' onClick={ () => { this.setState({ sortCardsModalShow: true }); } }><i className='fa fa-pencil'></i>&nbsp;编辑顺序</Button> }
          <div style={ styles } className={ indexLoading && 'hide' }>
            <span className='default-set'>默认结果：</span>
            { this.state.defaultSetShow ? 
              <div className='default-set'>
                <div className='edit-field-content'>
                  <FormControl componentClass='select' type='text' ref='defaultValue' disabled={ this.state.defaultSetLoadingShow }>
                    { collection.map( itemOption => <option value={ itemOption.id } key={ itemOption.id } selected={ itemOption.default && true }>{ itemOption.name }</option>) }
                  </FormControl>
                </div>
                <image src={ img } className={ this.state.defaultSetLoadingShow ? 'loading' : 'hide' }/>
                <div className={ this.state.defaultSetLoadingShow ? 'hide' : 'edit-field-content' }>
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
        { this.state.createModalShow && <CreateModal show close={ this.createModalClose } create={ create }/> }
        { this.state.sortCardsModalShow && <SortCardsModal show close={ this.sortCardsModalClose } cards={ collection } setSort={ setSort } sortLoading={ sortLoading }/> }
      </div>
    );
  }
}
