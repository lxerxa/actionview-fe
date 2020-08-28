import React, { PropTypes, Component } from 'react';
import { Modal, Form, InputGroup, Button, ControlLabel, FormControl, FormGroup, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

const SimpleMDE = require('SimpleMDE');
const img = require('../../assets/images/loading.gif');

let simplemde = {};

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0, name: '', touched: false, isSendMsg: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    path: PropTypes.array.isRequired,
    isHome: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    setRouterNotifyFlg: PropTypes.func.isRequired,
    goto: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  async handleSubmit() {
    const { create, goto, setRouterNotifyFlg } = this.props;
    const ecode = await create({ name: this.state.name, contents: simplemde.value(), isSendMsg: this.state.isSendMsg });
    if (ecode === 0) {
      setRouterNotifyFlg(false);
      this.setState({ ecode: 0 });
      notify.show('New 完成。', 'success', 2000);
      goto('list');
    } else {
      this.setState({ ecode: ecode });
    }
  }

  handleCancel() {
    const { loading, goto } = this.props;
    if (loading) {
      return;
    }
    this.setState({ ecode: 0 });
    goto('list');
  }

  componentWillMount() {
    const { isHome, setRouterNotifyFlg } = this.props;
    if (isHome) {
      this.state.name = 'Home';
    }
    setRouterNotifyFlg(false);
  }

  componentDidMount() {
    const fileeditDOM = document.getElementById('fileedit');
    if (fileeditDOM) {
      simplemde = new SimpleMDE({ 
        element: fileeditDOM,
        previewRender: (text) => simplemde.markdown(text), 
        autoDownloadFontAwesome: false, 
        showIcons: ['table'], 
        hideIcons: ['side-by-side', 'fullscreen'], 
        spellChecker: false, 
        status: false });

      const self = this;
      simplemde.codemirror.on('change', function() {
        const { loading, setRouterNotifyFlg } = self.props;
        if (!loading) {
          setRouterNotifyFlg(simplemde.value() && true);
        }
      });
    }
  }

  render() {
    const { i18n: { errMsg }, loading, path } = this.props;

    return (
      <div style={ { marginTop: '15px' } }>
        <div style={ { fontSize: '25px', fontWeight: 400, marginBottom: '5px' } }>
          New Wiki
        </div>
        <FormGroup validationState={ this.state.touched && !this.state.name && 'error' || null }>
          <InputGroup>
            <InputGroup.Button>
              <Button> / { _.map(path, (v) => v.id === '0' ? '' : (v.name + ' / ')) }</Button>
            </InputGroup.Button>
            <FormControl 
              disabled={ loading } 
              type='text'
              value={ this.state.name } 
              onChange={ (e) => { this.setState({ name: e.target.value }) } } 
              onBlur={ (e) => { this.setState({ touched: true }) } }
              placeholder='请输入标题名'/>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <textarea name='field' id='fileedit'></textarea>
        </FormGroup>
        <div style={ { float: 'right', marginTop: '-5px' } }>
          <span style={ { marginRight: '20px', color: 'red' } }>{ this.state.ecode !== 0 && !loading && errMsg[this.state.ecode] }</span>
          <img src={ img } className={ loading ? 'loading' : 'hide' }/>
          <Checkbox
            disabled={ loading }
            checked={ this.state.isSendMsg }
            onClick={ () => { this.setState({ isSendMsg: !this.state.isSendMsg }) } }
            style={ { display: 'inline-block', marginRight: '20px', marginLeft: '10px' } }>
            通知项目成员
          </Checkbox>
          <Button disabled={ loading || !this.state.name } bsStyle='success' onClick={ this.handleSubmit }>保存</Button>
          <Button bsStyle='link' disabled={ loading } onClick={ this.handleCancel }>Cancel</Button>
        </div>
      </div>
    );
  }
}
