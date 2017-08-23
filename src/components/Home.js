import React from 'react';
import Util from 'util';
import Mpj from '../lib/mpj-converter';
import FileSelect from './FileSelect';
import DownloadAtMenu from './DownloadAt';

import RaisedButton from 'material-ui/RaisedButton';
import List, { ListItem, makeSelectable } from 'material-ui/List';
import { IconMenu, MenuItem } from 'material-ui/IconMenu';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Truncate from 'react-truncate';
import fileDownload from 'react-file-download';
import CopyToClipboard from 'react-copy-to-clipboard';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

import PropTypes from 'prop-types';

// import Highlight from 'react-highlight';
// import 'highlight.js/styles/default.css';

import JSZip from 'jszip';
import Path from 'path';

let SelectableList = makeSelectable(List);
class ItemList extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedIndex: 0,
            showTooltips: []
        };
    }

    componentWillMount() {
        const data = this.props.data;
        if (this.state.showTooltips.length !== data.length) {
            this.setState({ showTooltips: new Array(data.length) });
        }
    }

    handleRequestChange = (e, index) => {
        this.setState({ selectedIndex: index });
        if (this.props.onChange !== undefined) {
            this.props.onChange(index);
        }
    }

    handleTruncate = (is, i) => {
        if (this.state.showTooltips[i] === is) {
            return;
        }
        let tips = this.state.showTooltips;
        tips[i] = is;
        this.setState({ showTooltips: tips });
    }

    render() {
        const iconButtonElement = (
            <IconButton touch={true} >
                <MoreVertIcon color={grey400} />
            </IconButton>
        );


        var arr = [];
        const data = this.props.data;

        arr = data.map((x, i) => {
            const rightIconMenu = (
                <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onClick={() => this.props.onRemoveClick(x, i)}>Remove</MenuItem>
                </IconMenu>
            );

            const text = (<Truncate
                onTruncate={(is) => this.handleTruncate(is, i)}
                lines={1} key={x.name} ellipsis='...'>
                {x.name}
            </Truncate >);

            const tooltip = <Tooltip
                key={x.name}
                placement="right"
                overlay={<span>{x.name}</span>}
                arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                {text}
            </Tooltip>;

            const res = this.state.showTooltips[i] ? tooltip : text;
            return <ListItem value={i}
                rightIconButton={rightIconMenu}
                key={x}
                primaryText={
                    <div style={{ paddingRight: '32px' }}>
                        {res}
                    </div>
                }
            />;
        });
        const style = {
            minHeight: 60,
            margin: 10,
            textAlign: 'center',
        };

        return (
            <Paper style={style} zDepth={1}>
                <div>Files</div>
                <SelectableList onChange={this.handleRequestChange} value={this.state.selectedIndex}>
                    {arr}
                </SelectableList>
            </Paper>
        );
    }
}
ItemList.propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onRemoveClick: PropTypes.func.isRequired
};



class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedFiles: [],
            selectedIndex: null,
            notifications: OrderedSet(),
            notificationCount: 0
        };
    }

    addNotification = (title, message, time = 5000) => {
        const id = this.state.notificationCount;
        this.setState({
            notifications: this.state.notifications.add({
                title: title,
                message: message,
                key: id,
                action: 'Dismiss',
                dismissAfter: time,
                onClick: (notification, deactivate) => {
                    deactivate();
                    this.removeNotification(id);
                },
            }),
            notificationCount: id + 1
        });
    }

    removeNotification = (count) => {
        this.setState({
            notifications: this.state.notifications.filter(n => n.key !== count)
        });
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

    onChange = (e) => {
        e.files.forEach(file => {
            var reader = new FileReader();
            reader.onerror = this.errorHandler;
            reader.onload = () => {
                Mpj.decompress(reader.result)
                    .then(value => {
                        this.state.selectedFiles.push({ name: file.name, value: value });
                        if (this.state.selectedIndex === null) {
                            this.selectFile(0);
                        } else {
                            this.setState({});
                        }
                    })
                    .catch(error => this.addNotification(file.name, "" + error));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    downloadCommand = () => {
        this.state.selectedFiles.forEach(data => fileDownload(data.value, this.getXMLName(data.name)));
    }

    selectFile = (index) => {
        this.setState({
            selectedIndex: index,
            output: this.state.selectedFiles[index].value
        });
    }

    onRemoveClick = (x, i) => {
        const { selectedFiles } = this.state;
        selectedFiles.splice(i, 1);
        this.setState({ selectedFiles: selectedFiles });
    }

    getBaseName = (name) => {
        return Path.basename(name, Path.extname(name));
    }

    getXMLName = (name) => {
        return this.getBaseName(name) + '.xml';
    }

    onClickZip = () => {
        var zip = new JSZip();
        let fileNameCount = {};
        this.state.selectedFiles.forEach(file => {
            const name = this.getBaseName(file.name);
            if (name in fileNameCount) {
                const count = fileNameCount[name];
                zip.file(Util.format('%s (%d).xml', name, count), file.value);
            } else {
                fileNameCount[name] = 0;
                zip.file(name + ".xml", file.value);
            }
            fileNameCount[name]++;
        });
        zip.generateAsync({ type: "blob" })
            .then((content) => fileDownload(content, 'mpj2xml.zip'))
            .catch(error => this.addNotification("Zip Download", "" + error));
    }

    render() {
        const buttonStyle = { margin: '5px', };
        return (
            <div className='home-container' style={{ marginTop: '10px' }}>

                <FileSelect onChange={this.onChange} />
                <div style={{ margin: '5px' }}>
                    <div style={{ width: '400px', float: 'left' }}>
                        <RaisedButton style={buttonStyle} primary={true}
                            disabled={this.state.selectedFiles.length === 0}
                            onClick={this.downloadCommand} >
                            <span style={{ margin: '16px' }}>Download</span>
                        </RaisedButton>
                        <DownloadAtMenu
                            onClickZip={this.onClickZip}
                            disabled={this.state.selectedFiles.length === 0} />
                        <CopyToClipboard text={this.state.output}
                            onCopy={() => this.addNotification("Copied.", "", 2000)}>
                            <RaisedButton style={buttonStyle} primary={true}
                                disabled={this.state.selectedFiles.length === 0}>
                                <span style={{ margin: '16px' }}>Copy</span>
                            </RaisedButton>
                        </CopyToClipboard>
                        <ItemList onChange={this.selectFile} onRemoveClick={this.onRemoveClick} data={this.state.selectedFiles} />
                    </div>

                    <div style={{ float: 'left', }}>
                        {/* <Highlight className='xml'>
                            {this.state.output}
                        </Highlight> */}
                        <pre>{this.state.output}</pre>
                        {/* <textarea style={{ resize: 'vertical', width: '540px', height: '400px' }} value={this.state.output} /> */}
                    </div>
                </div>
                <div style={{ zIndex: 1000000 }}>
                    <NotificationStack
                        notifications={this.state.notifications.toArray()}
                        onDismiss={notification => {
                            this.setState({
                                notifications: this.state.notifications.delete(notification)
                            });
                        }} />
                </div>
            </div>
        );
    }
}

export default Home;
