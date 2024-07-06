import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class YourChartComponent extends Component {
  constructor(props) {
    super(props);
    const { data, status } = props;
    this.state = {
      series: [{
        name: 'Giá trị',
        data: data.map((item) => item[status]),
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          stacked: true,
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          type: 'text',
          categories: data.map((item) => item.date),
        },
        legend: {
          position: 'right',
          offsetY: 20,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top',
            },
          },
        },

        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.status !== this.props.status) {
      const { data, status } = this.props;

      this.setState({
        series: [{
          data: data.map((item) => item[status]),
        }],
        options: {
          ...this.state.options,
          xaxis: {
            ...this.state.options.xaxis,
            categories: data.map((item) => item.date),
          },
        },
      });
    }
  }

  render() {
    return (
      <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height="100%" width="100%" />
    );
  }
}

export default YourChartComponent;
