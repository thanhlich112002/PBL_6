import React, { useState, useEffect } from 'react';
import style from './Voucher.module.css';
import Header2 from "../../components/Header/Header";
import Loading from '../../components/Loading/Loading'
import Modal from '@mui/material/Modal';
import axios from 'axios';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import HileVoucher from './HideVoucher'

const notify = (er, message) => toast[er](message, {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
});

const Voucher = ({ setSelected }) => {
  useEffect(() => {
    setSelected("Phiếu giảm giá");
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [openVoucher, setOpenVoucher] = useState(false);
  const [openHileVoucher, setOpenHileVoucher] = useState(false);
  const [VoucherItem, setVoucherItem] = useState([]);
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://falth-api.vercel.app/api/voucher`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.data);
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [])
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = dateObject.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  };


  const Addvocher = async (data) => {
    try {
      setOpenVoucher(false)
      await axios.post(`https://falth-api.vercel.app/api/voucher`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      notify("success", "Thêm thành công");
      fetchData();
    } catch (error) {
      notify("error", "Thêm thất bại");
      console.log(error);
    }
  };
  const HileVoucherByID = async (id) => {
    try {
      setOpenHileVoucher(false)
      await axios.put(`https://falth-api.vercel.app/api/voucher/${id}`, { "": "" }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      notify("success", "Đã ẩn Voucher");
      fetchData();
    } catch (error) {
      notify("error", "Ẩn thất bại");
      console.log(error);
    }
  };


  return (
    <div className={style.full}>
      <Header2 title={"Phiếu giảm giá"} />
      {isLoading ? (
        <div className={style.isloading}><Loading /></div>
      ) : (
        <div className={style.container}>
          <div className={style.listvoucher}>
            {data && data.map((item) =>
              <div className={style.voucher} onClick={() => { setOpenHileVoucher(true); setVoucherItem(item) }}>
                <div className={style.Image}>
                  <img src="https://falth.vercel.app/static/media/cutlery.ca1460e7a17e0ba85b81.png" alt="" />
                </div>
                <div className={style.infomation}>
                  <span>Giảm {item.amount}đ cho đơn từ {item.conditions.minValues}đ</span>
                  <span>Đã dùng : {item.numUsers} </span>
                  <span className={style.title}>{item.name}</span>
                  <span className={style.title}>Sử dụng đến : {formatDate(item.conditions.endDate)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <i className="fa-solid fa-circle" style={{
                    color: item.isAvailable ? "#00a400" : "#f35369c2"
                  }}></i>
                </div>

              </div>

            )}
            <div className={style.voucher} onClick={() => setOpenVoucher(true)}>
              <div className={style.Image}>
                <i class="fa-solid fa-plus"></i>
              </div>
              <div className={style.infomation}>
                <span >Thêm phiếu giảm giá mới</span>
              </div>
            </div>
            {openVoucher && <AddVoucher open={openVoucher} setOpenVoucher={setOpenVoucher} Addvocher={Addvocher} />}
            {openHileVoucher && <HileVoucher open={openHileVoucher} setOpenHileVoucher={setOpenHileVoucher} VoucherItem={VoucherItem} HileVoucherByID={HileVoucherByID} />}
          </div>
        </div>
      )
      }
    </div >
  );
};



const AddVoucher = ({ open, setOpenVoucher, Addvocher }) => {

  function getFormattedCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [formData, setFormData] = useState({
    username: '',
    amount: '',
    minValue: '',
    fromDate: getFormattedCurrentDate(),
    toDate: getFormattedCurrentDate(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "toDate" && new Date(value) < new Date(formData.fromDate)) {
      setFormData((prevData) => ({ ...prevData, [name]: formData.fromDate }));
      return;
    }
    if (name === "fromDate" && new Date(value) > new Date(formData.toDate)) {
      setFormData((prevData) => ({ ...prevData, ["toDate"]: value }));
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const priceRegExp = /^[1-9]\d*000$/;
  const handleSaveChanges = () => {
    const schema = yup.object().shape({
      username: yup.string().required("Tên phiếu mua hàng là bắt buộc").min(1, "Tên không được để trống"),
      amount: yup.string().required("Giá tiền là bắt buộc").matches(priceRegExp, "Giá tiền không hợp lệ"),
      minValue: yup.string().required("Giá tiền là bắt buộc").matches(priceRegExp, "Giá tiền không hợp lệ"),
      fromDate: yup.date().required("Từ ngày là bắt buộc"),
      toDate: yup.date().required("Đến ngày là bắt buộc"),
    });
    schema.validate(formData)
      .then(valid => {
        console.log('Dữ liệu đã lưu:', formData);
        const data = {
          "name": formData.username,
          "amount": formData.amount,
          "conditions": {
            "minValues": formData.minValue,
            "startDate": formData.fromDate,
            "endDate": formData.toDate,
          }
        }
        Addvocher(data)
      })
      .catch(errors => notify("error", errors.message));
  };

  return (
    <Modal open={open}>
      <div className={style.AddVoucher_container}>
        <div className={style.editForm}>
          <h3>Thay đổi thông tin phiếu mua hàng</h3>
          <label htmlFor="username">Tên phiếu mua hàng</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="amount">Số tiền được giảm</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <label htmlFor="minValue">Giá trị tối thiểu</label>
          <input
            type="text"
            name="minValue"
            value={formData.minValue}
            onChange={handleChange}
          />
          <label htmlFor="fromDate">Từ ngày</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
          />
          <label htmlFor="toDate">Đến ngày</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
          />
          <button className={style.btn_cancel} onClick={handleSaveChanges}>Lưu thay đổi</button>
          <button className={style.btn_cancel} onClick={() => setOpenVoucher(false)}>Hủy bỏ</button>
        </div>
      </div>
    </Modal>
  );
};




export default Voucher;
