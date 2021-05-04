import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import axios from 'axios';
import 'primeflex/primeflex.css';
import {TabPanel, TabView} from "primereact/tabview";
//My Components
import {RefreshButton} from '../Components/refreshButton'
import {DeleteButton} from '../Components/deleteButton'
import {PmbInputText} from "../Components/pmbInputText";
import {PmbButton} from "../Components/pmbButton";
import {Toast} from "primereact/toast";

export class UserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableValues: [],
            //Search
            searchValueName: '',
            searchValueSurname: '',
            searchValueEmail: '',
            //Delete
            deleteValue: '',
            //Reset Pass
            emailValue: '',
            oldPassValue: '',
            newPassValue: '',
            confirmPassValue: '',
        }
        this.myToast = React.createRef()
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (
            <>
                <Toast ref={this.myToast}/>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Filtrar' leftIcon='pi pi-filter'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getUsers}/>
                            <PmbInputText onChange={this.changeValueName} value={this.state.searchValueName}
                                          size={'p-md-3'} name={'Nombre'}/>
                            <PmbInputText onChange={this.changeValueSurname} value={this.state.searchValueSurname}
                                          size={'p-md-3'} name={'Apellidos'}/>
                            <PmbInputText onChange={this.changeValueEmail} value={this.state.searchValueEmail}
                                          size={'p-md-3'} name={'Email'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Eliminar' leftIcon='pi pi-trash'>
                        <div className='p-grid p-fluid'>
                            <DeleteButton onClick={this.delUser}/>
                            <PmbInputText onChange={(e) => this.setState({deleteValue: e.target.value})}
                                          value={this.state.deleteValue}
                                          size={'p-md-3'} name={'Email'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Restablecer clave' leftIcon='pi pi-reply'>
                        <div className='p-grid p-fluid'>
                            <PmbInputText onChange={(e) => this.setState({emailValue: e.target.value})}
                                          value={this.state.emailValue}
                                          size={'p-md-6'} name={'Email'}/>
                            <PmbInputText onChange={(e) => this.setState({oldPassValue: e.target.value})}
                                          value={this.state.oldPassValue}
                                          size={'p-md-6'} name={'Contraseña'}/>
                            <PmbInputText onChange={(e) => this.setState({newPassValue: e.target.value})}
                                          value={this.state.newPassValue}
                                          size={'p-md-6'} name={'Nueva contraseña'}/>
                            <PmbInputText onChange={(e) => this.setState({confirmPassValue: e.target.value})}
                                          value={this.state.confirmPassValue}
                                          size={'p-md-6'} name={'Confirmar contraseña'}/>
                        </div>
                        <PmbButton label={'Restablecer'} icon={'pi pi-refresh'} onClick={this.resetPass}/>
                    </TabPanel>
                </TabView>
                <div className='card'>
                    <DataTable value={this.state.tableValues}>
                        <Column field='EmailId' header='Email'/>
                        <Column field='Nombre' header='Nombre'/>
                        <Column field='Apellidos' header='Apellidos'/>
                        <Column field='Edad' header='Edad'/>
                    </DataTable>
                </div>
            </>
        );
    }

    //Input handlers
    changeValueName = (event) => {
        this.setState({searchValueName: event.target.value}, () => {
            this.state.searchValueName !== '' ? this.filterByName() : this.getUsers();
            this.setState({searchValueEmail: '', searchValueSurname: ''})
        })
    }
    changeValueSurname = (event) => {
        this.setState({searchValueSurname: event.target.value}, () => {
            this.state.searchValueSurname !== '' ? this.filterBySurname() : this.getUsers();
            this.setState({searchValueName: '', searchValueEmail: ''})
        })
    }
    changeValueEmail = (event) => {
        this.setState({searchValueEmail: event.target.value}, () => {
            this.state.searchValueEmail !== '' ? this.filterByEmail() : this.getUsers();
            this.setState({searchValueName: '', searchValueSurname: ''})
        })
    }

    //Axios requests
    getUsers = () => {
        this.axiosRequest('https://localhost:44390/api/Usuarios')
    }
    filterByName = () => {
        this.axiosRequest('https://localhost:44390/api/Usuarios?name=' + this.state.searchValueName)
    }
    filterByEmail = () => {
        this.axiosRequest('https://localhost:44390/api/Usuarios?emailid=' + this.state.searchValueEmail);
    }
    filterBySurname = () => {
        this.axiosRequest('https://localhost:44390/api/Usuarios?surname=' + this.state.searchValueSurname)
    }
    delUser = () => {
        if (this.state.deleteValue !== '') {
            this.advAxiosRequest('https://localhost:44390/api/Usuarios?email=' + this.state.deleteValue, 'https://localhost:44390/api/Usuarios', 'User deleted', 'delete')
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({deleteValue: ''});
    }
    resetPass = () => {
        const notEmpty = this.state.oldPassValue !== '' && this.state.newPassValue !== '' && this.state.confirmPassValue !== '';
        if (notEmpty) {
            let resetdata = {
                OldPassword: this.state.oldPassValue,
                NewPassword: this.state.newPassValue,
                ConfirmPassword: this.state.confirmPassValue
            }
            axios.post('https://localhost:44390/api/Account/ChangePasswordEmail?email=' + this.state.emailValue, resetdata).catch((err) => {
                if (err != null) {
                    this.showToast('error', 'Request Error');
                }
            }).then((response) => {
                if (response != null) {
                    this.showToast('success', 'Contraseña cambiada');
                }
            });
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({oldPassValue: '', newPassValue: '', confirmPassValue: ''})
    }

    //My Funcs
    //Axios
    axiosRequest = (url) => {
        axios.get(url).then((response) => {
            this.setState({tableValues: response.data});
        })
    }
    advAxiosRequest = (url, callbackUrl, succesMessage, requestType) => {
        if (requestType === 'delete') {
            this.req = axios.delete;
        }
        if (requestType === 'post') {
            this.req = axios.post;
        }
        if (requestType === 'put') {
            this.req = axios.put;
        }
        if (requestType === 'get') {
            this.req = axios.get;
        }

        this.req(url).then((response) => {
            if (response !== null) {
                this.showToast('success', succesMessage);
                this.axiosRequest(callbackUrl);
            }
        }).catch((err) => {
            if (err != null) {
                this.showToast('error', 'Request Error');
            }
        });
    }
    //Toast
    showToast = (severityValue, summaryValue, detailValue) => {
        this.myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});
    }
}

