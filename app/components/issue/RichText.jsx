import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Lightbox from 'react-image-lightbox';

const inlineAttachment = require('inlineAttachment2');
const SimpleMDE = require('SimpleMDE');
const marked = require('marked');

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
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
      onChange, 
      onBlur, 
      value, 
      disabled,
      placeholder 
    } = this.props;

    const DOM = document.getElementById(id);

    this.editor = new SimpleMDE({
      element: DOM,
      placeholder: placeholder,
      previewRender: (text) => this.editor.markdown(text),
      autoDownloadFontAwesome: false,
      showIcons: ['table'],
      hideIcons: ['side-by-side', 'fullscreen'],
      spellChecker: false,
      status: false
    }); 

    const self = this;
    this.editor.codemirror.on('change', function() {
      onChange(self.editor.value());
    });

    this.editor.codemirror.on('blur', function() {
      onBlur && onBlur();
    });

    this.editor.value(value || '');

    const inlineAttachmentConfig = {
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
      uploadUrl: uploadUrl 
    };
    inlineAttachment.editors.codemirror4.attach(this.editor.codemirror, inlineAttachmentConfig);
  }

  componentWillReceiveProps(nextProps) {
    this.editor.codemirror.options.readOnly = nextProps.disabled && true;
  }

  componentWillUnmount() {
    delete this.editor.codemirror;
    delete this.editor;
  }

  //componentDidUpdate(preProps) {
  //  if (preProps.id != this.props.id) {
  //    delete this.editor.codemirror;
  //    delete this.editor;
  //    const parentNode = document.getElementById(this.props.id + '-parent'); 
  //    parentNode.innerHTML = '<textarea id="' + this.props.id + '"></textarea>';
  //    this.create();
  //  }
  //}

  render() {
    const { id } = this.props;

    return (
      <div className='rich-text-editor markdown-body'>
        <textarea id={ id }></textarea>
      </div>
    );
  }
}

class RichTextReader extends React.Component {
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

  extractImg(key, value) {
    marked.setOptions({ breaks: true });
    let html = marked(value);
    const images = html.match(/<img(.*?)>/ig);
    const imgFiles = [];
    if (images) {
      _.forEach(images, (v, i) => {
        const pattern = new RegExp('^<img src="(.*?)"(.*?)>$');
        if (pattern.exec(v)) {
          const imgurl = RegExp.$1;
          if (!imgurl) {
            return;
          }
          html = html.replace(v, '<img class="inline-img" id="inlineimg-' + key + '-' + i + '" src="' + (imgurl.indexOf('http') === 0 ? imgurl : (imgurl + '/thumbnail')) + '"/>');
          imgFiles.push(imgurl);
        }
      });
    }
    return { html, imgFiles };
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
      value 
    } = this.props;
    const { inlinePreviewShow, photoIndex } = this.state;

    const { html, imgFiles } = this.extractImg(fieldKey, value || '');

    return (
      <div className='issue-text-field markdown-body'>
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
  RichTextEditor,
  RichTextReader
}
