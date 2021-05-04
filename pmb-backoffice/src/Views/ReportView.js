import React, {Component} from "react";
import {Chart} from 'primereact/chart'
import axios from "axios";
import {TabPanel, TabView} from "primereact/tabview";


export class ReportView extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            listLabelsBets: [],
            listDataBets: [],
            listLabelsUsers: [],
            listDataUsers: [],
        }
    }

    componentDidMount() {
        this.getDataBets();
        this.getCountBets();
        this.getDataUsers();
        this.getCountUsers();
    }

    render() {
        const DataBets = {
            labels: this.state.listLabelsBets,
            datasets: [
                {
                    label: 'Apuestas por días',
                    backgroundColor: '#743380',
                    data: this.state.listDataBets
                }
            ]
        };
        const DataUsers = {
            labels: this.state.listLabelsUsers,
            datasets: [
                {
                    label: 'Usuarios por días',
                    backgroundColor: '#743380',
                    data: this.state.listDataUsers
                }
            ]
        };
        let basicOptions = {
            legend: {
                labels: {
                    fontColor: 'White'
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: 'White'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: 'White'
                    }
                }]
            }
        };

        return (
            <>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Apuestas por día'>
                        <div className="card">
                            <Chart type="line" data={DataBets} options={basicOptions}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Altas por día'>
                        <div className="card">
                            <Chart type="line" data={DataUsers} options={basicOptions}/>
                        </div>
                    </TabPanel>
                </TabView>

            </>
        );
    }

    getDataBets = () => {
        axios.get('https://localhost:44390/api/Apuestas/getDates').then((response) =>
            this.setState({listLabelsBets: response.data})
        )
    }
    getCountBets = () => {
        axios.get('https://localhost:44390/api/Apuestas/getCount').then((response) =>
            this.setState({listDataBets: response.data})
        )
    }
    getDataUsers = () => {
        axios.get('https://localhost:44390/api/Usuarios/getDates').then((response) =>
            this.setState({listLabelsUsers: response.data})
        )
    }
    getCountUsers = () => {
        axios.get('https://localhost:44390/api/Usuarios/getCount').then((response) =>
            this.setState({listDataUsers: response.data})
        )
    }
}
