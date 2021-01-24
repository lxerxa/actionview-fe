import React, { PropTypes, Component } from 'react';
import { FormControl } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';

const $ = require('$');
const inlineAttachment = require('inlineAttachment2');

class MultiRowsTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    uploadUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { 
      id, 
      uploadUrl, 
      onChange 
    } = this.props;

    const self = this;
    $('#' + id).inlineattachment({
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
      uploadUrl: uploadUrl,
      onFileUploaded: (editor, filename) => {
        self.setState({ value: editor.getValue() });
        onChange(editor.getValue());
      },
      onFileReceived: (editor, file) => {
        self.setState({ value: editor.getValue() });
        onChange(editor.getValue());
      }
    });
  }

  render() {
    const { 
      id,
      value,
      disabled,
      onChange,
      onBlur,
      placeholder
    } = this.props;

    return (
      <FormControl
        id={ id }
        componentClass='textarea'
        disabled={ disabled }
        value={ this.state.value }
        onChange={ (e) => { this.setState({ value: e.target.value }); onChange(e.target.value); } }
        onBlur={ onBlur }
        style={ { height: '180px' } }
        placeholder={ placeholder } />
    );
  }
}

class MultiRowsTextReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { photoIndex: 0, inlinePreviewShow: false };
    this.previewInlineImg = this.previewInlineImg.bind(this);
  }

  static propTypes = {
    isImgPreviewed: PropTypes.bool,
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }

  extractImg(key, txt) {
    const images = txt.match(/!\[(.*?)\]\((.*?)\)/ig);
    const imgFiles = [];
    if (images) {
      _.forEach(images, (v, i) => {
        const pattern = new RegExp('^!\\[(.*?)\\]\\((.*?)\\)$');
        if (pattern.exec(v)) {
          const imgurl = RegExp.$2;
          if (!imgurl) {
            return;
          }
          const alt = RegExp.$1 || '';
          txt = txt.replace(v, '<div><img class="inline-img" id="inlineimg-' + key + '-' + i + '" src="' + (imgurl.indexOf('http') === 0 ? imgurl : (imgurl + '/thumbnail')) + '" alt="' + alt + '"/></div>');
          imgFiles.push(imgurl);
        }
      });
      txt = txt.replace(/<\/div>(\s*?)<div>/ig, '');
    }

    const links = txt.match(/\[.*?\]\(.*?\)/ig);
    if (links) {
      _.forEach(links, (v, i) => {
        const pattern = new RegExp('^\\[(.*?)\\]\\((.*?)\\)$');
        pattern.exec(v);
        txt = txt.replace(v, '<a target="_blank" href="' + RegExp.$2 + '">' + RegExp.$1 + '</a>');
      });
    }
    return { html: txt.replace(/(\r\n)|(\n)/g, '<br/>'), imgFiles };
  }

  previewInlineImg(e) {

    const { isImgPreviewed } = this.props;
    if (!isImgPreviewed) {
      notify.show('权限不足。', 'error', 2000);
      return;
    }

    const targetid = e.target.id;
    if (!targetid) {
      return;
    }

    let imgInd = -1;
    if (targetid.indexOf('inlineimg-') === 0) {
      imgInd = targetid.substr(targetid.lastIndexOf('-') + 1) - 0;
    } else {
      return;
    }

    this.setState({ inlinePreviewShow: true, photoIndex: imgInd });
  }

  render() {
    const { 
      isEditable, 
      onEdit,
      fieldKey, 
      value='' 
    } = this.props;
    const { inlinePreviewShow, photoIndex } = this.state;

    const { html, imgFiles } = this.extractImg(fieldKey, value);

    return (
      <div className='issue-text-field'>
        { isEditable &&
          <div className='edit-button' onClick={ () => { onEdit && onEdit() } }><i className='fa fa-pencil'></i></div> }
        <div
          onClick={ this.previewInlineImg.bind(this) }
          dangerouslySetInnerHTML={ { __html: html || '<span style="color: #909090">未设置</span>' } } />
        { inlinePreviewShow &&
          <Lightbox
            mainSrc={ imgFiles[photoIndex] }
            nextSrc={ imgFiles[(photoIndex + 1) % imgFiles.length] }
            prevSrc={ imgFiles[(photoIndex + imgFiles.length - 1) % imgFiles.length] }
            imageTitle=''
            imageCaption=''
            onCloseRequest={ () => { this.setState({ inlinePreviewShow: false }) } }
            onMovePrevRequest={ () => this.setState({ photoIndex: (photoIndex + imgFiles.length - 1) % imgFiles.length }) }
            onMoveNextRequest={ () => this.setState({ photoIndex: (photoIndex + 1) % imgFiles.length }) } /> }
      </div>
    );
  }
}

module.exports = {
  MultiRowsTextEditor,
  MultiRowsTextReader
}
