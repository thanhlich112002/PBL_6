import { useState, useRef, useEffect } from 'react'
import style from './Navbar.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Navbar() {
    const [open, setOpen] = useState(false);
    const [Notification, setNotification] = useState(false);
    const formRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setOpen(false);
                setNotification(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (

        <div className={style.container}>
            {open && (
                <div className={style.add} ref={formRef}>
                    <Link to='/product' className={style.profile}>
                        <div className={style.profile1}>
                            <img
                                src="./avata.jpg"
                                alt=""
                                className={style.avatar_image1}
                            />
                            <div >
                                <span>Nguyễn Thanh Lịch</span>
                            </div>
                        </div>
                    </Link>
                    <Link to='/product' className={style.profile} >

                        <div className={style.avatar_image1}>
                            <img
                                src="./cart-shopping-solid.svg"
                                alt=""
                                style={{ margin: '5px' }}

                            />
                        </div>
                        <span>
                            Sản phẩm</span>
                        <img className={style.angright} src="./angle-right-solid.svg" alt="" />
                    </Link >
                    <Link to='/custumer' className={style.profile} >
                        <div className={style.avatar_image1}>
                            <img

                                src="./user-solid.svg"
                                alt=""
                                style={{ margin: '5px' }}

                            />
                        </div>
                        <span>Đơn hàng</span>
                        <img className={style.angright} src="./angle-right-solid.svg" alt="" />

                    </Link>
                    <Link to='/custumer' className={style.profile} >
                        <div className={style.avatar_image1}>
                            <img
                                style={{ margin: '5px' }}
                                src="./right-from-bracket-solid.svg"
                                alt=""

                            />
                        </div>
                        <span>Đăng xuất</span>
                        <img className={style.angright} src="./angle-right-solid.svg" alt="" />

                    </Link>

                </div>
            )}
            {Notification && (
                <div className={style.notification} ref={formRef}>
                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>
                        </div>

                    </div>
                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>
                        </div>

                    </div>
                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>
                        </div>

                    </div>
                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>
                        </div>

                    </div>                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>
                        </div>

                    </div>                    <div className={style.notification1}>
                        <div >
                            <img className={style.avatar_image} src="./avata.jpg" alt="" />
                        </div>
                        <div className={style.notification12}>
                            <span style={
                                {
                                    fontSize: '18px',

                                }
                            }
                            >Nguyễn Thanh Lịch</span>
                            <span style={
                                {
                                    fontSize: '12px',

                                }
                            }>Nguyễn Thanh Lịch đã mua hàng của bạn</span>
                            <span style={
                                {
                                    fontSize: '12px',
                                    color: 'blue'

                                }
                            }>11:30</span>

                        </div>

                    </div>
                </div>
            )}

            <div className={style.logo_search}>
                <div className={style.logo}>FALTH</div>
                <div className={style.search}>
                    <input type="text" placeholder='Search...' className={style.search_input} />
                    <img
                        src="./search.svg"
                        alt=""
                        className={style.image_search}
                    />
                </div>
            </div>

            <div className={style.info}>
                <div className={style.features}>
                    <div className={style.item} onClick={() => { setNotification(true) }}>
                        <img src="./bell-solid.svg" alt="" />
                        <div className={style.quantity}>4</div>
                    </div>
                    <div className={style.item}>
                        <img src="./bars-solid.svg" alt="" />
                        <div className={style.quantity}>4</div>

                    </div>
                </div>
                <div className={style.avatar} onClick={() => { setOpen(true) }}>
                    <img
                        src="./avata.jpg"
                        alt=""
                        className={style.avatar_image}
                    />
                </div>

            </div>
        </div>
    )
}

export default Navbar
