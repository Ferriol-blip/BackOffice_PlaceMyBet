import React, {Component} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import axios from 'axios';
import {TabView, TabPanel} from 'primereact/tabview';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import moment from "moment";
//My Components
import {RefreshButton} from '../Components/refreshButton'
import {InsertButton} from '../Components/insertButton'
import {DeleteButton} from '../Components/deleteButton'
import {PmbInputText} from "../Components/pmbInputText";
import {Toast} from "primereact/toast";
import {ModButton} from "../Components/modButton";

export class EventView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableValues: [],
            //search
            searchValue: '',
            searchValueDate: '',
            //delelte
            deleteValue: '',
            //insert
            insertValueLocal: '',
            insertValueVisitor: '',
            insertValueDate: '',
            //Mod
            modValueId: '',
            modValueDate: '',
        }
        this.myToast = React.createRef()
    }

    componentDidMount() {
        this.getEvents();
    }

    render() {
        return (
            <>
                <Toast ref={this.myToast}/>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Filtrar' leftIcon='pi pi-filter'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getEvents}/>
                            <PmbInputText onChange={this.changeValueTitle} value={this.state.searchValue}
                                          size={'p-md-4'} name={'Titulo'}/>
                            <PmbInputText onChange={this.changeValueDate} value={this.state.searchValueDate}
                                          size={'p-md-4'} name={'Fecha'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Eliminar' leftIcon='pi pi-trash'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getEvents}/>
                            <DeleteButton onClick={this.delEvent}/>
                            <PmbInputText onChange={(e) => this.setState({deleteValue: e.target.value})}
                                          value={this.state.deleteValue}
                                          size={'p-md-4'} name={'Eliminar'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Agregar' leftIcon='pi pi-plus-circle'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getEvents}/>
                            <InsertButton onClick={this.insertEvent}/>
                            <PmbInputText onChange={(e) => this.setState({insertValueLocal: e.target.value})}
                                          value={this.state.insertValueLocal}
                                          size={'p-md-3'} name={'Local'}/>
                            <PmbInputText onChange={(e) => this.setState({insertValueVisitor: e.target.value})}
                                          value={this.state.insertValueVisitor}
                                          size={'p-md-3'} name={'Visitante'}/>
                            <PmbInputText onChange={(e) => this.setState({insertValueDate: e.target.value})}
                                          value={this.state.insertValueDate}
                                          size={'p-md-3'} name={'Fecha'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Actualizar' leftIcon='pi pi-pencil'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getEvents}/>
                            <ModButton onClick={this.actEvent}/>
                            <PmbInputText onChange={(e) => this.setState({modValueId: e.target.value})}
                                          value={this.state.modValueId}
                                          size={'p-md-3'} name={'ID'}/>
                            <PmbInputText onChange={(e) => this.setState({modValueDate: e.target.value})}
                                          value={this.state.modValueDate}
                                          size={'p-md-3'} name={'Fecha'}/>
                        </div>
                    </TabPanel>
                </TabView>
                <div className='card'>
                    <DataTable value={this.state.tableValues}>
                        <Column field='EnventoId' header='ID'/>
                        <Column field='Local' header='Equipo Local'/>
                        <Column field='Visitante' header='Equipo visitante'/>
                        <Column field='Fecha' header='Fecha'/>
                    </DataTable>
                </div>
            </>
        );
    }

    //Input handlers
    changeValueTitle = (event) => {
        this.setState({searchValue: event.target.value}, () => {
            this.state.searchValue !== '' ? this.filterByTitle() : this.getEvents();
            this.setState({searchValueDate: ''})
        })
    }
    changeValueDate = (event) => {
        this.setState({searchValueDate: event.target.value}, () => {
            this.state.searchValueDate !== '' ? this.filterByDate() : this.getEvents();
            this.setState({searchValue: ''})
        })
    }

    //Axios request
    getEvents = () => {
        this.axiosRequest('https://localhost:44390/api/Eventos')
    }
    filterByTitle = () => {
        this.axiosRequest('https://localhost:44390/api/Eventos?titulo=' + this.state.searchValue)
    }
    filterByDate = () => {
        this.axiosRequest('https://localhost:44390/api/Eventos?date=' + this.state.searchValueDate)
    }
    delEvent = () => {
        const notEmpty = this.state.deleteValue !== '';
        if (notEmpty) {
            this.advAxiosRequest('https://localhost:44390/api/Eventos/' + this.state.deleteValue,
                'https://localhost:44390/api/Eventos', 'Evento eliminado', 'delete')
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({deleteValue: ''})
    }
    actEvent = () => {
        const notEmpty = this.state.modValueDate !== '' && this.state.modValueId !== '';
        if (notEmpty) {
            this.advAxiosRequest('https://localhost:44390/api/Eventos?idEvento=' + this.state.modValueId + '&date=' + this.state.modValueDate,
                'https://localhost:44390/api/Eventos', 'Fecha actualizada', 'put')
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({actValueId: '', actValueDate: ''})
    }
    insertEvent = () => {
        const notEmpty = this.state.insertValueDate !== '' && this.state.insertValueVisitor !== '' && this.state.insertValueLocal !== '';
        if (notEmpty) {
            let evento = {
                Local: this.state.insertValueLocal,
                Visitante: this.state.insertValueVisitor,
                Fecha: this.state.insertValueDate
            };
            axios.post('https://localhost:44390/api/Eventos', evento).catch((err) => {
                if (err != null) {
                    this.showToast('error', 'Request Error')
                }
            }).then((response) => {
                if (response.data) {
                    this.getEvents();
                    this.showToast('success', 'Evento agregado');
                }
            })
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({insertValueVisitor: '', insertValueLocal: '', insertValueDate: ''});
    }

    //My Funcs
    //Axios
    axiosRequest = (url) => {
        axios.get(url).then((response) => {
            this.changeFormat(response);
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
            if (response.data) {
                this.showToast('success', succesMessage);
                this.axiosRequest(callbackUrl);
            } else {
                this.showToast('error', 'Request Error')
            }
        }).catch((err) => {
            if (err != null) {
                this.showToast('error', 'Request Error');
            }
        });
    }
    //data table format
    changeFormat = (response) => {
        response.data.forEach(o => o.Fecha = moment(o.Fecha).format("YYYY-MM-DD"));
    }
    //Toast
    showToast = (severityValue, summaryValue, detailValue) => {
        this.myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});
    }
}
