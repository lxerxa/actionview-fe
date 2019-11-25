import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const logo = require('../../assets/images/brand.png');

export default class AboutModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static propTypes = {
    close: PropTypes.func.isRequired
  }

  handleCancel() {
    const { close } = this.props;
    close();
  }

  render() {
    const { close } = this.props;

    return (
      <Modal show onHide={ this.handleCancel } backdrop='static' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>关于</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ { overflow: 'auto' } }>
          <div style={ { margin: '20px 0px', textAlign: 'center' } }><img src={ logo } width={ 150 }/></div>
          <div style={ { textAlign: 'center' } }>
            <span>当前版本: 1.9.0</span>
            <a href='https://github.com/lxerxa/actionview/releases' target='_blank'><span style={ { marginLeft: '10px' } }>新版变化</span></a>
          </div>
          <div style={ { marginTop: '30px' } }>
            <table style={ { width: '100%' } }>
              <tr>
                <td style={ { textAlign: 'right', paddingRight: '15px' } }>
                  <iframe
                    src='https://ghbtns.com/github-btn.html?user=lxerxa&repo=actionview&type=star&count=true'
                    frameBorder='0'
                    scrolling='0'
                    width='100px'
                    height='20px'>
                  </iframe>
                </td>
                <td style={ { textAlign: 'left', paddingLeft: '15px' } }>
                  <iframe
                    src='https://ghbtns.com/github-btn.html?user=lxerxa&repo=actionview&type=fork&count=true'
                    frameBorder='0'
                    scrolling='0'
                    width='100px'
                    height='20px'>
                  </iframe>
                </td>
              </tr>
            </table>
          </div>
          <div style={ { margin: '40px' } }>
            <span>一个面向中小企业的、开源免费的、简单易用的、类Jira的问题需求跟踪工具。目标是成为企业开源研发工具链中的重要一环。</span>
          </div>
          <div style={ { margin: '40px', textAlign: 'center' } }>
            <span>想帮忙吗？<a href='https://github.com/lxerxa/actionview' target='_blank'>欢迎参与！</a></span>
            <span>有什么问题或建议，<a href='https://github.com/lxerxa/actionview/issues' target='_blank'>欢迎提出！</a></span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href='https://github.com/lxerxa/actionview/blob/master/LICENSE.txt' target='_blank'>
            <span style={ { float: 'left', marginTop: '5px', marginLeft: '5px' } }>授权信息</span>
          </a>
          <Button onClick={ this.handleCancel }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

