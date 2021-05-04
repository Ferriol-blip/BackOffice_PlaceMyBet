import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import axios from 'axios';
import moment from 'moment';
import 'primeflex/primeflex.css';
import {TabView, TabPanel} from 'primereact/tabview';
//My Components
import {RefreshButton} from '../Components/refreshButton'
import {InsertButton} from '../Components/insertButton'
import {PmbInputText} from "../Components/pmbInputText";
import {PmbButton} from "../Components/pmbButton";
import {Toast} from "primereact/toast";


export class BetView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableValues: [],
            //Search
            searchValue: '',
            ValueIdMercado: '',
            ValueIdEvento: '',
            ValueIdEmail: '',
            //Insert
            insertValue: '',
            //Block
            blockValue: '',
            unblockValue: '',
        }
        this.myToast = React.createRef()
    }

    componentDidMount() {
        this.getBets();
    }

    render() {
        return (
            <>
                <Toast ref={this.myToast}/>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Filtrar' leftIcon='&nbsp;pi pi-filter'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getBets}/>
                            <PmbInputText onChange={this.changeValueIdMercado} value={this.state.ValueIdMercado}
                                          size={'p-md-3'} name={'ID Mercado'}/>
                            <PmbInputText onChange={this.changeValueIdEvento} value={this.state.ValueIdEvento}
                                          size={'p-md-3'} name={'ID Evento'}/>
                            <PmbInputText onChange={this.changeValueEmail} value={this.state.ValueIdEmail}
                                          size={'p-md-4'} name={'Email'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Insertar Mercados' leftIcon='pi pi-plus-circle'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getBets}/>
                            <InsertButton onClick={this.insertMarkets}/>
                            <PmbInputText onChange={(e) => this.setState({insertValue: e.target.value})}
                                          value={this.state.insertValue}
                                          size={'p-md-3'} name={'ID Evento'}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Bloquear Mercados' leftIcon='pi pi-minus-circle'>
                        <div className='p-grid p-fluid'>
                            <RefreshButton onClick={this.getBets}/>
                            <PmbButton label={'Bloquear'} icon={'pi pi-minus-circle'} onClick={this.blockMarket}/>
                            <PmbButton label={'Desbloquear'} icon={'pi pi-check-circle'} onClick={this.unblockMarket}/>
                            <PmbInputText onChange={(e) => this.setState({blockValue: e.target.value})}
                                          value={this.state.blockValue}
                                          size={'p-md-3'} name={'ID Mercado'}/>
                        </div>
                    </TabPanel>
                </TabView>
                <div className='card'>
                    <DataTable value={this.state.tableValues}>
                        <Column field='ApuestaId' header='ID' style={{width: '5%'}}/>
                        <Column field='UsuarioId' header='Usuario' style={{width: '15%'}}/>
                        <Column field='TipoMercado' header='Mercado' style={{width: '10%'}}/>
                        <Column field='TipoApuesta' header='Tipo' style={{width: '10%'}}/>
                        <Column field='Cuota' header='Cuota' style={{width: '10%'}}/>
                        <Column field='Dinero' header='Dinero' style={{width: '10%'}}/>
                        <Column field='MercadoId' header='ID Mercado' style={{width: '10%'}}/>
                        <Column field='Mercado.bloqueado' header='Mercado Bloqueado' style={{width: '10%'}}/>
                        <Column field='Mercado.EventoId' header='ID Evento' style={{width: '10%'}}/>
                        <Column field='Fecha' header='Fecha' style={{width: '15%'}}/>
                    </DataTable>
                </div>
            </>
        );
    }

    //Input handlers
    changeValueIdMercado = (event) => {
        this.setState({ValueIdMercado: event.target.value}, () => {
            this.state.ValueIdMercado !== '' ? this.filterByIdMercado() : this.getBets();
        })
        this.setState({ValueIdEvento: '', ValueIdEmail: ''})
    }
    changeValueIdEvento = (event) => {
        this.setState({ValueIdEvento: event.target.value}, () => {
            this.state.ValueIdEvento !== '' ? this.filterByIdEvento() : this.getBets();
        })
        this.setState({ValueIdMercado: '', ValueIdEmail: ''})
    }
    changeValueEmail = (event) => {
        this.setState({ValueIdEmail: event.target.value}, () => {
            this.state.ValueIdEmail !== '' ? this.filterByEmail() : this.getBets();
        })
        this.setState({ValueIdEvento: '', ValueIdMercado: ''})
    }

    //Axios request
    getBets = () => {
        this.axiosRequest('https://localhost:44390/api/Apuestas')
    }
    filterByIdMercado = () => {
        this.axiosRequest('https://localhost:44390/api/Apuestas?idmercado=' + this.state.ValueIdMercado)
    }
    filterByEmail = () => {
        this.axiosRequest('https://localhost:44390/api/Apuestas?email=' + this.state.ValueIdEmail)
    }
    filterByIdEvento = () => {
        this.axiosRequest('https://localhost:44390/api/Apuestas?idevento=' + this.state.ValueIdEvento)
    }
    blockMarket = () => {
        if (this.state.blockValue !== '') {
            this.advAxiosRequest('https://localhost:44390/api/Mercados/blockMarket?idmercado=' + this.state.blockValue,
                'https://localhost:44390/api/Apuestas', 'Mercado bloqueado', 'put');
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({blockValue: ''});
    }
    unblockMarket = () => {
        if (this.state.blockValue !== '') {
            this.advAxiosRequest('https://localhost:44390/api/Mercados/unblockMarket?idmercado=' + this.state.blockValue,
                'https://localhost:44390/api/Apuestas', 'Mercado desbloqueado', 'put');
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({blockValue: ''});
    }
    insertMarkets = () => {
        if (this.state.insertValue !== '') {
            this.advAxiosRequest('https://localhost:44390/api/Mercados?idEvento=' + this.state.insertValue,
                'https://localhost:44390/api/Apuestas', 'Mercado agregado', 'post');
        } else {
            this.showToast('warn', 'Campos Vacíos')
        }
        this.setState({insertValue: ''});
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
        response.data.forEach(o => o.Dinero += "€");
        response.data.forEach(o => o.Mercado.bloqueado ? o.Mercado.bloqueado = 'Bloq.' : o.Mercado.bloqueado = 'Desbloq.');
    }
    //Toast
    showToast = (severityValue, summaryValue, detailValue) => {
        this.myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});
    }
}
