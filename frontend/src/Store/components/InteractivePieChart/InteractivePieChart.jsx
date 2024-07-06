import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  translateStatusToVietnamese(status) {
    let translatedStatus;

    switch (status) {
      case "Finished":
        translatedStatus = "Hoàn thành";
        break;
      case "Refused":
        translatedStatus = "Từ chối";
        break;
      case "Cancelled":
        translatedStatus = "Hủy bỏ";
        break;
      case "Preparing":
        translatedStatus = "Đang chuẩn bị";
        break;
      case "Ready":
        translatedStatus = "Sẵn sàng";
        break;
      case "Delivering":
        translatedStatus = "Đang giao hàng";
        break;
      case "Waiting":
        translatedStatus = "Đợi người gia";
        break;
      case "Pending":
        translatedStatus = "Chờ thanh toán";
        break;
      default:
        translatedStatus = "Không xác định";
        break;
    }

    return translatedStatus;
  }

  getColorByStatus(status) {
    const colorMap = {
      "Finished": "#4CAF50", // Màu xanh lá cây cho trạng thái Hoàn thành
      "Refused": "#FF5722", // Màu cam cho trạng thái Từ chối
      "Cancelled": "#F44336", // Màu đỏ cho trạng thái Hủy bỏ
      "Preparing": "#FFC107", // Màu vàng cho trạng thái Đang chuẩn bị
      "Ready": "#FFC107", // Màu vàng cho trạng thái Sẵn sàng
      "Delivering": "#2196F3", // Màu xanh dương cho trạng thái Đang giao hàng
      "Waiting": "#9E9E9E", // Màu xám cho trạng thái Chờ đợi
      "Pending": "#7E9E9E", // Màu xám cho trạng thái Chờ đợi
    };

    return colorMap[status] || "#000000"; // Màu đen mặc định hoặc một màu khác tùy ý
  }

  constructor(props) {
    super(props);

    const { data, status, cat } = props;

    this.state = {
      series: data.map((item) => item[status]),
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
        labels: cat
          ? data.map((item) => this.translateStatusToVietnamese(item._id))
          : data.map((item) => this.translateStatusToVietnamese(item._id)),
        colors: cat
          ? data.map((item) => this.getColorByStatus(item._id))
          : data.map((item) => this.getColorByStatus(item._id)),
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const { data, status, cat } = this.props;

      this.setState({
        series: data.map((item) => item[status]),
        options: {
          ...this.state.options,
          labels: cat
            ? data.map((item) => this.translateStatusToVietnamese(item._id))
            : data.map((item) => item._id),
          colors: cat
            ? data.map((item) => this.getColorByStatus(item._id))
            : [],
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
