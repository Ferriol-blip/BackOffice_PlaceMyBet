import {Button} from "primereact/button";
import React, {Component} from "react";

export class PmbButton extends Component {
    render() {
        return (
            <div className='p-m-2'>
                <Button label={this.props.label} onClick={this.props.onClick} icon={this.props.icon}/>
            </div>
        )
    }
}
