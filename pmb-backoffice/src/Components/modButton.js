import React, {Component} from "react";
import {Button} from 'primereact/button';

export class ModButton extends Component {
    render() {
        return (
            <div className='p-m-2'>
                <Button icon={'pi pi-pencil'} onClick={this.props.onClick}/>
            </div>
        )
    }
}
