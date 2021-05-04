import {InputText} from "primereact/inputtext";
import {Component} from "react";


export class PmbInputText extends Component {
    render() {
        return (
            <div className={this.props.size}>
                <div className="p-inputgroup">
                    <span className='p-inputgroup-addon'>{this.props.name}</span>
                    <InputText value={this.props.value} onChange={this.props.onChange}
                               type='text'/>
                </div>
            </div>
        )
    }
}
