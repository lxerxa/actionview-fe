import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import _ from 'lodash';

const CreateModal = require('./CreateModal');
const SortCardsModal = require('../share/SortCardsModal');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createModalShow: false, sortCardsModalShow: false };
    this.createModalClose = this.createModalClose.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    isSysConfig: PropTypes.bool.isRequired,
    create: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    indexLoading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  sortCardsModalClose() {
    this.setState({ sortCardsModalShow: false });
  }

  render() {
    const { i18n, isSysConfig, create, setSort, loading, indexLoading, collection } = this.props;

    return (
      <div>
        <div style={ { marginTop: '5px' } }>
          <Button className='create-btn' onClick={ () => { this.setState({ createModalShow: true }); } } disabled={ indexLoading }>
            <i className='fa fa-plus'></i>&nbsp;New 状态
          </Button>
          { !indexLoading &&
          <Button
            className='create-btn'
            onClick={ () => { this.setState({ sortCardsModalShow: true }); } }>
            <i className='fa fa-pencil'></i>&nbsp;编辑顺序
          </Button> }
        </div>
        <div className='info-col'>
          <div className='info-icon'><i className='fa fa-info-circle'></i></div>
          <div className='info-content'>
            <span>状态是指执行工作流过程中问题of状态，定义工作流时和某一步骤绑定。<br/>只能删除没有关联到工作流{ isSysConfig && '（包括各项目自定义工作流）' }和没有应用到项目问题中of状态。</span>
          </div>
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
            model='Status'
            close={ this.sortCardsModalClose.bind(this) }
            cards={ collection }
            setSort={ setSort }
            sortLoading={ loading }
            i18n={ i18n }/> }
      </div>
    );
  }
}
