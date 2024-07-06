import axios from "axios";
const moment = require('moment');
const url = "https://falth-api.vercel.app";

const checkStoreOpen = (openAt, closeAt)  => {
  const currentTime = new Date();
  const openTime = new Date(currentTime);
  const closeTime = new Date(currentTime);

  // Set the time portion of the date objects
  openTime.setHours(Number(openAt.split(':')[0]), Number(openAt.split(':')[1]), 0, 0);
  closeTime.setHours(Number(closeAt.split(':')[0]), Number(closeAt.split(':')[1]), 0, 0);
  return (currentTime >= openTime && currentTime <= closeTime);
}

const checkValidCart = async (products) => {
  for (const product of products) {
    const data = await getProductByProductId(product._id);
    if (data.isOutofOrder) {
      return data.name; // Nếu có bất kỳ sản phẩm nào không hợp lệ, trả về false ngay lập tức
    }
  }
  return 'true'; // Nếu tất cả sản phẩm đều hợp lệ, trả về true
}

//Auth
const loginAPI = async (email, password) => {
  return axios.post(`${url}/api/auth/login`, { email, password });
}

// Info user

const getUserInfo = async (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const api = `${url}/api/user/${decodedToken.id}`

  const response = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

const getDefaultContact = async (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const api = `${url}/api/user/get-default-contact/${decodedToken.id}`
  const response = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

const addContact = async (e, formData) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const response = await axios.put(`${url}/api/user/add-contact/${decodedToken.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm liên hệ', error);
  }
};

const updateDefaultContact = async (e, id) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    await axios.post(`${url}/api/user/set-default-contact/${decodedToken.id}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  } catch (error) {

    console.error('Lỗi khi set defaultContact', error);
  }
}

const updateContact = async (e, formData, id, isChecked) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if(isChecked) {
      
    }
    const response = await axios.patch(`${url}/api/user/${decodedToken.id}/contact/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm liên hệ', error);
  }
};

const deleteContact = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const api = `${url}/api/user/del-contact/${decodedToken.id}/${id}`
    const response = await axios.delete(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Lỗi khi xóa liên hệ', error);
  }
}

const updateAvatar = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const api = `${url}/api/user/${decodedToken.id}/photo`
    const response = await axios.patch(api, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật ảnh đại diện', error);
  }
}



//Info Store
const getStoreById = async (id) => {
  const api = `${url}/api/store/${id}`
  const response = await axios.get(api);
  return response.data;
}

//Category
const getAllCategory = async () => {
  const api = `${url}/api/category`
  const response = await axios.get(api);
  return response.data;
}

const getAllCategoryByStoreId = async (id) => {
  const api = `${url}/api/category/store/${id}`
  const response = await axios.get(api);
  return response.data;
}

//Product
const getProductByStoreId = async (storeId, catName, search) => {
  const token = localStorage.getItem("token");
  const api = `${url}/api/product/store/${storeId}?search=${search}&category.catName=${catName}&limit=100`
  const response = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

const getProductByProductId = async (id) => {
  const token = localStorage.getItem("token");
  const api = `${url}/api/product/${id}`
  const response = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

//cart
const getFeeShip = async (idStore) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(user);
  try {
    const response = await axios.get(`${url}/api/user/${userData._id}/store/${idStore}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.log('Lỗi khi lấy thông tin phí ship: ', error)
  }
}

//order

const placeOrder = async (totalPrice, shipCost, contactId) => {
  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const cart = JSON.parse(localStorage.getItem("cart"));

  const products = cart.products.map((product) => ({
    quantity: product.amount,
    price: product.price,
    product: product._id,
    notes: product.specialRequest
  }));
  const orderData = {
    cart: products, 
    contact: contactId,
    totalPrice: totalPrice,
    shipCost: shipCost,
  };
  try {
    const response = await axios.post(`${url}/api/order/user/${decodedToken.id}/store/${cart.idStore}`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

const getAllOderByUserId = async () => {
  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const startDate = moment().subtract(1, 'months').format("DD-MM-YYYY");
  const endDate = moment().format("DD-MM-YYYY");
  try {
    const response = await axios.get(`${url}/api/order/user/${decodedToken.id}?sort=-dateOrdered&start=${startDate}&end=${endDate}&fields=status,dateOrdered,totalPrice&page=1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error get order:", error);
  }
}

const getOderByFilter = async (fromDate, toDate, status, page) => {
  if (status === 'All') {
    status = ''
  }
  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const api = `${url}/api/order/user/${decodedToken.id}?status=${status}&fields=status,dateOrdered,totalPrice&sort=-createdAt&limit=10&page=${page}&start=${fromDate}&end=${toDate}`
  try {
    const response = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error get order:", error);
  }
}

const viewOrder = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${url}/api/order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error get order:", error);
  }
}

const createPayment = async (query) => {
  const token = localStorage.getItem("token");
  const api = `${url}/api/order/after-checkout/payment${query}`;
  try {
    const response = await axios.get(api , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

const cancelOrder = async (id) => {
  const token = localStorage.getItem("token");
  const api = `${url}/api/order/${id}`;
  try {
    const response = await axios.patch(api , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.log("Error:", error);
  }
}

//Rating 
const getRatingOfStore = async (storeId, number) => {
  let api;
  if (number) {
    api = `${url}/api/store/${storeId}/rating/?number=${number}`
  } else {
    api = `${url}/api/store/${storeId}/rating`
  }
  try {
    const response = await axios.get(api);
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

const addRatingForStore = async (id, ratingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${url}/api/store/${id}/rating`, ratingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: 'multipart/form-data',
      }
    });
    // return response.data
  } catch (error) {
    console.log('đánh giá thất bại:', error)
  }
}

const updateRatingForStore = async (id, ratingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(`${url}/api/rating/${id}`, ratingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: 'multipart/form-data',
      }
    });
    // return response.data
  } catch (error) {
    console.log('Chỉnh sửa đánh giá thất bại:', error)
  }
}

const getRatingOfProduct = async (productID, number) => {
  const token = localStorage.getItem("token");
  try {
    let api;
  if (number) {
    api = `${url}/api/product/${productID}/rating/?number=${number}`
  } else {
    api = `${url}/api/product/${productID}/rating`
  }
  console.log(api)
    const response = await axios.get(api);
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

const addRatingForProduct = async (id, ratingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${url}/api/product/${id}/rating`, ratingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: 'multipart/form-data',
      }
    });
  } catch (error) {
    console.log('Đánh giá thất bại:', error)
  }
}

const deleteRating = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const api = `${url}/api/rating/${id}`
    const response = await axios.delete(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá', error);
  }
}

const getRatingOfShipper = async (shipperID, number) => {
  try {
    const token = localStorage.getItem("token");
    let api;
  if (number) {
    api = `${url}/api/shipper/${shipperID}/rating/?number=${number}`
  } else {
    api = `${url}/api/shipper/${shipperID}/rating`
  }
    const response = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

//Shipper

const getShipper = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const api = `${url}/api/shipper/${id}`
    const response = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

//Voucher

const getVoucherByStoreId = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const api = `${url}/api/voucher/store/${id}`
    const response = await axios.get(api);
    // , {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

const applyVoucher = async (idVoucher, idOrder) => {
  try {
    const token = localStorage.getItem("token");
    const api = `${url}/api/voucher/${idVoucher}/order/${idOrder}`
    const response = await axios.put(api, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });  
    console.log(response); 
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

export {
  checkStoreOpen,
  checkValidCart,
  loginAPI,
  getUserInfo,
  addContact,
  deleteContact,
  getStoreById,
  getDefaultContact,
  updateAvatar,
  getAllCategory,
  getAllCategoryByStoreId,
  updateDefaultContact,
  updateContact,
  getProductByStoreId,
  getProductByProductId,
  getFeeShip,
  placeOrder,
  getAllOderByUserId,
  viewOrder,
  createPayment,
  getOderByFilter,
  cancelOrder,
  getRatingOfStore,
  addRatingForStore, 
  updateRatingForStore,
  getRatingOfProduct,
  addRatingForProduct,
  deleteRating, 
  getRatingOfShipper,
  getShipper,
  getVoucherByStoreId,
  applyVoucher
}