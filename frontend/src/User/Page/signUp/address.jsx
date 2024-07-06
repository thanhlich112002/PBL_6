import { useState, useEffect } from "react";
import axios from "axios";

function useLocationSelect() {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Gửi yêu cầu HTTP để lấy dữ liệu từ nguồn dữ liệu JSON
    axios
      .get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    // Tìm quận/huyện dựa trên tỉnh/thành phố được chọn
    const selectedCity = cities.find((city) => city.Name === selectedCityId);
    if (selectedCity) {
      setDistricts(selectedCity.Districts);
    } else {
      setDistricts([]);
    }
  };

  const handleCityChange2 = async (selectedCityName) => {
  if (selectedCityName !== "") {
    let selectedCity;
    if (cities.length > 0) {
      selectedCity = cities.find((city) => city.Name.includes(selectedCityName));
    } else {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
        selectedCity = response.data.find((city) => city.Name.includes(selectedCityName));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    setDistricts(selectedCity.Districts);
  } else {
    setDistricts([]);
  }
};

const handleDistrictChange = (e) => {
  const selectedDistrictId = e.target.value;
  // Tìm phường/xã dựa trên quận/huyện được chọn
  const selectedDistrict = districts.find((district) => district.Name === selectedDistrictId);
  if (selectedDistrict) {
    setWards(selectedDistrict.Wards);
  } else {
    setWards([]);
  }
};

return {
  cities,
  districts,
  wards,
  handleCityChange,
  handleDistrictChange,
  handleCityChange2
};
}

export default useLocationSelect;
