import React, {Component} from "react";
import {Button} from 'primereact/button';

export class RefreshButton extends Component {
    render() {
        return (
            <div className='p-m-2'>
                <Button icon={'pi pi-refresh'} onClick={this.props.onClick}/>
            </div>
        )
    }
}
