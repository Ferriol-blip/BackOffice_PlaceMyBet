import './App.css';
import {Switch, Route, NavLink} from "react-router-dom";
import {UserView} from "./Views/UserView";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primereact/resources/primereact.css';
import * as React from "react";
import {BetView} from "./Views/BetView";
import {EventView} from "./Views/EventView";
import {ReportView} from "./Views/ReportView";
import {Button} from 'primereact/button';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        return (
            <div className='background'>
                <div className={'menuBar'}>
                    <Button className="p-button-raised p-button-text">
                        <NavLink to="/users" activeClassName={'active'} className={'link'}>Usuarios</NavLink>
                    </Button>
                    <Button className="p-button-raised p-button-text">
                        <NavLink to="/bets" activeClassName={'active'} className={'link'}>Apuestas</NavLink>
                    </Button>
                    <Button className="p-button-raised p-button-text">
                        <NavLink to="/events" activeClassName={'active'} className={'link'}>Eventos</NavLink>
                    </Button>
                    <Button className="p-button-raised p-button-text">
                        <NavLink to="/reports" activeClassName={'active'} className={'link'}>Informes</NavLink>
                    </Button>
                </div>
                <Switch>
                    <Route path={'/users'}>
                        <UserView/>
                    </Route>
                    <Route path={'/bets'}>
                        <BetView/>
                    </Route>
                    <Route path={'/events'}>
                        <EventView/>
                    </Route>
                    <Route path={'/reports'}>
                        <ReportView/>
                    </Route>
                    <Route path={'*'} exact>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default App;
