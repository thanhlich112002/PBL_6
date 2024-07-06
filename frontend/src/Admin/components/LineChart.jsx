import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    const { data, status } = props;

    this.state = {

      series: [{
        name: "Doanh thu",
        data: data.map((item) => item.revenue),
      },
      ],
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5],
          curve: 'straight',
          dashArray: [0, 8, 5]
        },
        legend: {
          tooltipHoverFormatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: status ? data.map((item) => item.date) : data.map((item) => item._id),
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return val
                }
              }
            },
            {
              title: {
                formatter: function (val) {
                  return val
                }
              }
            },
            {
              title: {
                formatter: function (val) {
                  return val;
                }
              }
            }
          ]
        },
        grid: {
          borderColor: '#f1f1f1',
        }
      },


    };
  }

  componentDidUpdate(prevProps) {
    // Kiểm tra nếu prop 'data' thay đổi
    if (this.props.data !== prevProps.data || this.props.status !== prevProps.status) {
      const { data, status } = this.props;
      console.log(data);
      // Cập nhật trạng thái 'series' khi prop 'data' thay đổi
      this.setState({
        series: [
          {
            name: "Doanh thu",
            data: data.map((item) => item.revenue),
          },
        ],
        options: {
          ...this.state.options,
          xaxis: {
            ...this.state.options.xaxis,
            categories: status ? data.map((item) => item.date) : data.map((item) => item._id),
          },
        },
      });
    }
  }

  render() {
    return (
      <ReactApexChart options={this.state.options} series={this.state.series} type="line" height="100%" />
    );
  }
}

export default ApexChart;
