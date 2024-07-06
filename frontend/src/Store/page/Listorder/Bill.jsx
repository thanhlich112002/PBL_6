import React from 'react'
import style from './Bill.module.css';

function Bill({ row }) {
    console.log(row.idorder)
    return (
        <>
            <div className={style.container}>
                <div >
                    <div className={style.Store}>
                        <div className={style.Name_store}>
                            <div >
                                <span>Nguyễn Thanh Lịch</span>
                            </div>
                        </div>
                        <div className={style.addres_store}>
                            <div >
                                <span>130 phạm như xương</span>
                            </div>
                        </div>
                        <div className={style.addres_store}>
                            <div >
                                <span>SĐT: 0776230217-0935114043</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.Store}>
                    <div >
                        <div className={style.bill}>
                            <div >
                                <span>Nguyễn Thanh Lịch</span>
                            </div>
                        </div>
                        <div >
                            <div className={style.bill_stt}>
                                <span> Số HĐ :</span>
                                <span> DH001</span>
                            </div>
                        </div>
                        <div className={style.bill_time} >
                            <div className={style.bill_stt}>
                                <span>Ngày : </span>
                                <span> 11/05/2002</span>
                            </div>
                            <div className={style.bill_stt}>
                                <span>Giờ :</span>
                                <span>12:15</span>
                            </div>
                        </div>
                        <div >
                            <div className={style.bill_stt}>
                                <span> Khách hàng :</span>
                                <span> Nguyễn Thanh Lịch</span>
                            </div>
                        </div>
                        <div >
                            <div className={style.bill_stt}>
                                <div className={style.table_order} style={{ maxHeight: '155px', margin: '10px 0px', border: '1px' }}>
                                    <table className={style.t_order}>
                                        <thead className={style.lichngu} >
                                            <tr>
                                                <th style={{ width: '30%' }}>Tên</th>
                                                <th style={{ width: '20%' }}>SL</th>
                                                <th style={{ width: '20%' }}>Giá tiền</th>
                                                <th style={{ width: '30%' }}>Tinh tiền </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                            <tr>
                                                <td>Trà đào</td>
                                                <td>1</td>
                                                <td>20.000đ</td>
                                                <td>20.000đ</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div style={{ display: 'flex', paddingRight: '10%' }}>
                                    <div className={style.bill_stt} style={{ flex: ' 30%', paddingLeft: '10%' }}>
                                        <span>Tổng cộng </span>
                                    </div>
                                    <div className={style.bill_stt} style={{ flex: ' 20%' }}>
                                        <span>9 </span>
                                    </div>
                                    <div className={style.bill_stt} style={{ flex: ' 40%', textAlign: 'right' }}>
                                        <span>200.000đ</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={style.bill}>
                            <div >
                                <span>Cảm ơn quý khách - hẹn gặp lại!</span>
                            </div>
                        </div>
                    </div>
                </div></div>
        </>

    )
}

export default Bill
