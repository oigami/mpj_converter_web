import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import { Menu, MenuItem } from 'material-ui';
import PropTypes from 'prop-types';

export default class DownloadAtMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleTouchTap = (event) => {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose = () => {
        this.setState({ open: false, });
    }

    onClick = (func, e) => {
        func(e);
        this.handleRequestClose();
    }

    render() {
        return (<span>
            <RaisedButton primary={true}
                onClick={this.handleTouchTap}
                disabled={this.props.disabled}
            ><span style={{ margin: '16px' }}>Download at ...</span></RaisedButton>
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose} >
                <Menu>
                    <MenuItem primaryText="Zip" onClick={(e) => this.onClick(this.props.onClickZip, e)} />
                </Menu>
            </Popover>
        </span>);
    }
}
DownloadAtMenu.propTypes = {
    onClickZip: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};