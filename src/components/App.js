import React from 'react';
import Header from './Header';
import Home from './Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider >
                <BrowserRouter>
                    <div className='container'>
                        <Header />
                        <Switch>
                            <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
                            <Route render={function () {
                                return <p>Not Found</p>;
                            }} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </MuiThemeProvider>
        );
    }
}

export default App;
