import React from 'react';
import Dropzone from 'react-dropzone';
import { lightBlue50 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';

export default class FileUpload extends React.Component {

    constructor() {
        super();
        this.state = { mouseOver: false };
    }

    changeMessage(acceptedFiles) {
        this.props.onChange({ files: acceptedFiles });
    }

    errorHandler(evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                break; // noop
            default:
                alert('An error occurred reading this file.');
        }
    }

    mouseOver() {
        this.setState({ mouseOver: true });
    }

    mouseOut() {
        this.setState({ mouseOver: false });
    }

    render() {
        return (
            <div onMouseOver={() => this.mouseOver()} onMouseOut={() => this.mouseOut()}>
                <Dropzone
                    style={{
                        border: '2px dashed #bbb',
                        borderRadius: '8px',
                        padding: '25px',
                        textAlign: 'center',
                        cursor: this.state.mouseOver ? 'pointer' : 'auto',
                        background: this.state.mouseOver ? lightBlue50 : 'transparent'
                    }}
                    activeStyle={{
                        border: '2px dashed #bbb',
                        borderRadius: '8px',
                        padding: '25px',
                        textAlign: 'center',
                        background: lightBlue50
                    }}
                    onDropAccepted={this.changeMessage.bind(this)}>
                    <div>
                        .mpjファイルを指定またはドラッグ&ドロップ
                    </div>
                </Dropzone>
            </div>
        );
    }
}
FileUpload.propTypes = {
    onChange: PropTypes.func.isRequired,
};