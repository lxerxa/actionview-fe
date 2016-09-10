import React, { ReactText, PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import _ from 'lodash';

var mermaidAPI = require('mermaid').mermaidAPI;

export default class PreviewModal extends Component {
  constructor(props) {
    super(props);
    mermaidAPI.initialize({
      startOnLoad:false
    });
  }

  static propTypes = {
    collection: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired
  }

  render() {

    const { collection, close } = this.props;

    const stepNum = collection.length;

    let graphTxt = 'graph LR;S(( ))-->' + (collection.length > 0 ? collection[0].name : '-') + ';';
    for (let i = 0; i < stepNum; i++) {

      if (collection[i].actions && collection[i].actions.length <= 0) {
        graphTxt += collection[i].name + ';';
        continue;
      }

      _.map(collection[i].actions, function(v) {
        _.map(v.results, function(v2) {
          graphTxt += collection[i].name;
          graphTxt += '--' + v.name + '-->';
          graphTxt += _.find(collection, { id: v2.step }).name + ';';
        });
      });
    }

    return (
      <Modal { ...this.props } onHide={ close } backdrop='static' bsSize='large' aria-labelledby='contained-modal-title-sm'>
        <Modal.Header closeButton style={ { background: '#f0f0f0', height: '50px' } }>
          <Modal.Title id='contained-modal-title-la'>工作流预览</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mermaid' dangerouslySetInnerHTML={ { __html: mermaidAPI.render('xxx', graphTxt) } } />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ close }>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
