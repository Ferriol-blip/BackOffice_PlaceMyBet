import React, {Component} from "react";
import {Button} from 'primereact/button';

export class DeleteButton extends Component {
    render() {
        return (
            <div className='p-m-2'>
                <Button icon={'pi pi-trash'} onClick={this.props.onClick}/>
            </div>
        )
    }
}
