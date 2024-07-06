import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      series: data.map((item) => item.count),
      options: {
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        labels: data.map((item) => item._id),
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const { data } = this.props;

      this.setState({
        series: data.map((item) => item.count),
        options: {
          ...this.state.options,
          labels: data.map((item) => item._id),
        },
      });
    }
  }

  render() {
    return (
      <ReactApexChart options={this.state.options} series={this.state.series} type="pie" />
    );
  }
}

export default ApexChart;
