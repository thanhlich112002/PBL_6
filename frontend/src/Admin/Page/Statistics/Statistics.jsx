import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import style from './Statistics.module.css';
import LineChart from "../../components/LineChart";
import LineChartUser from "../../components/LineChartUser";
import Header2 from "../../components/Header/Header";
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const Statistics = ({ setSelected }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [dataorder, setDataorder] = useState([]);
    const [dataLineChart, setDataLineChart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(true);

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const navigate = useNavigate();

    useEffect(() => {
        setSelected("Thống kê");
    }, []);

    const fetchDataorder = async (value, year) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/admin/user/${value}?year=${year}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data.data;
            setDataorder(responseData);
            console.log(responseData);

        } catch (error) {
            console.log(error);
        }
    };

    const fetchDataLinechart = async (value, year) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/admin/revenue/${value}?year=${year}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDataLineChart(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDataselect = async (value) => {
        try {
            setIsLoading(true);
            if (value === "quarterly") {
                setStatus(false);
            } else {
                setStatus(true);
            }

            await fetchDataLinechart(value, selectedYear);
            await fetchDataorder(value, selectedYear);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const fetchDataselectYear = async (year) => {
        setSelectedYear(year);
        fetchDataorder("quarterly", year);
        fetchDataLinechart("quarterly", year);
    };

    const fetchData = async () => {
        try {
            await fetchDataLinechart("monthly");
            await fetchDataorder("monthly");
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, _id]);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="end">
                <Box><Header2 title={"Thống kê"} /></Box>
                <Box sx={{ gap: " 10px ", display: "flex" }}>
                    {status ? (<></>) : <div className={style.SelectTime}>
                        <select value={selectedYear} defaultValue={selectedYear} onChange={(event) => fetchDataselectYear(event.target.value)}>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>}

                    <div className={style.SelectTime}>
                        <select name="" id="" onChange={(event) => fetchDataselect(event.target.value)}>
                            <option value="monthly">Tháng</option>
                            <option value="quarterly">Quý</option>
                        </select>
                    </div>
                </Box>
            </Box>

            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridAutoRows="5vh"
                    gap="5px"
                >
                    <Box
                        gridColumn="span 12"
                        gridRow="span 7"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <div className={style.box}>
                            <div className={style.box1}>
                                <div className={style.container}>
                                    <div className={style.top}>
                                        <div className={style.tranding}>
                                            <span>Thống kê người dùng</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.LineChart}>
                                    <LineChartUser data={dataorder} status={status} />
                                </div>
                            </div>
                        </div>
                    </Box>

                    <Box
                        gridColumn="span 12"
                        gridRow="span 7"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <div className={style.box}>
                            <div className={style.box1}>
                                <div className={style.container}>
                                    <div className={style.top}>
                                        <div className={style.tranding}>
                                            <span>Thống kê doanh thu</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.LineChart}>
                                    <LineChart data={dataLineChart} status={status} />
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Statistics;
