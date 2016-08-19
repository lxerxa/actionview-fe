import React, { PropTypes, Component } from 'react';
import { Button, FormControl } from 'react-bootstrap';
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
    options: PropTypes.object.isRequired,
    createStep: PropTypes.func.isRequired
  }

  createStepModalClose() {
    this.setState({ createStepModalShow: false });
  }

  render() {
    const { createStep, options } = this.props;

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#工作流配置#</h2>
        </div>
        <div>
          <Button className='create-btn' onClick={ () => { this.setState({ createStepModalShow: true }); } }><i className='fa fa-plus'></i>&nbsp;新建步骤</Button>
        </div>
        { this.state.createStepModalShow && <CreateStepModal show close={ this.createStepModalClose } create={ createStep } options={ options }/> }
      </div>
    );
  }
}
