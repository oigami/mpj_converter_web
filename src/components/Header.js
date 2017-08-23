import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

function Header() {
    return (
        <div>
            <AppBar
                title="MPJ Converter"
                iconElementLeft={<span />}
                iconElementRight={
                    <FlatButton href={"https://github.com/oigami/MpjConverter"}>GitHub</FlatButton>
                }
            />
        </div>
    );
}

export default Header;