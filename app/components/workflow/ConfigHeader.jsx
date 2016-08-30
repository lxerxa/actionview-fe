import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

const CreateStepModal = require('./CreateStepModal');
const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { createStepModalShow: false };
    this.createStepModalClose = this.createStepModalClose.bind(this);
  }

  static propTypes = {
    pid: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    createStep: PropTypes.func.isRequired
  }

  createStepModalClose() {
    this.setState({ createStepModalShow: false });
  }

  render() {
    const { createStep, options, pid } = this.props;

    return (
      <div>
        <h2>#工作流配置#</h2>
        <div style={ { marginTop: '20px', marginBottom: '15px', padding: '8px', backgroundColor: '#ffffbd' } }><i className='fa fa-exclamation-triangle'></i>&nbsp;配置修改后，需保存才能生效。</div>
        <div>
          <Link to={ '/project/' + pid + '/workflow' }>
            <Button className='create-btn'><i className='fa fa-reply'></i>&nbsp;返回</Button>
          </Link>
          <Button className='create-btn' onClick={ () => { this.setState({ createStepModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建步骤</Button>
          <Button className='create-btn' onClick={ () => { this.setState({ createStepModalShow: true }); } } disabled={ true }><i className='fa fa-save'></i>&nbsp;保存</Button>
        </div>
        { this.state.createStepModalShow && <CreateStepModal show close={ this.createStepModalClose } create={ createStep } options={ options }/> }
      </div>
    );
  }
}
