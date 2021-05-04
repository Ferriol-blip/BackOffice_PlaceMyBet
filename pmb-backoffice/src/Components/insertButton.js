import React, {Component} from "react";
import {Button} from 'primereact/button';

export class InsertButton extends Component {
    render() {
        return (
            <div className='p-m-2'>
                <Button icon={'pi pi-plus-circle'} onClick={this.props.onClick}/>
            </div>
        )
    }
}
