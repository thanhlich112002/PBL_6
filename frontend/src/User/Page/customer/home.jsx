import React    , {useState, useEffect, useRef } from 'react';
import StoreItem from '../../Components/Item/storeItem';
import { useCity } from '../../services/CityContext';
import { useTranslation } from 'react-i18next';
import useLocationSelect from '../signUp/address';
import Skeleton from '../../Components/Skeleton/skeleton';
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const {
    cities,
    districts,
    handleCityChange2,
  } = useLocationSelect();

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsOpen1(false);
  };
  const handleToggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (dropdownRef1.current && !dropdownRef1.current.contains(e.target)) {
        setIsOpen1(false)
      }
    };

    if (isOpen1 || isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen1, isOpen]);

  const { selectedLocation, updateLocation, key, updateKey } = useCity();
  const [stores, setStores] = useState({ data: [] });

  const handleRemove = (name) => {
    if (name === "key") {
      updateKey("")
    } else if (name === "cat") {
      setSelectedCategories([])
    } else if (name === "area") {
      setSelectedAreas([])
    }
  }

  const [categories, setCategories] = useState({ data: [] })
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  useEffect(() => {
    // updateLocation('')
    const api = `https://falth-api.vercel.app/api/category`
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API', error);
      });
  }, []);

  useEffect(() => {
    setSelectedAreas([]);
    handleCityChange2(selectedLocation);
  }, [selectedLocation]);


  const handleCategoryChange = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      // Nếu categoryId đã tồn tại trong danh sách đã chọn, hãy loại bỏ nó
      setSelectedCategories(selectedCategories.filter(catName => catName !== categoryName));
    } else {
      // Nếu categoryId chưa tồn tại trong danh sách đã chọn, hãy thêm nó vào danh sách
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleAreaChange = (areaName) => {
    if (selectedAreas.includes(areaName)) {
      // Nếu categoryId đã tồn tại trong danh sách đã chọn, hãy loại bỏ nó
      setSelectedAreas(selectedAreas.filter(name => name !== areaName));
    } else {
      // Nếu categoryId chưa tồn tại trong danh sách đã chọn, hãy thêm nó vào danh sách
      setSelectedAreas([...selectedAreas, areaName]);
    }
  };

  useEffect(() => {
    setIsLoading(true)
    setStores({ data: [] })
    setPage(1)
    const selectedCat = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
    const selectedDistrict = selectedAreas.length > 0
  ? selectedAreas.map(area => area.replace(/(Quận|Huyện)\s+/g, '')).join(',')
  : ''; 
  const api = `https://falth-api.vercel.app/api/store?city=${selectedLocation}&district=${selectedDistrict}&catName=${selectedCat}&limit=12&isLocked=false&page=1&search=${key}`
    console.log(api)
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        console.log(data) 
        setStores(data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API', error);
        setIsLoading(false)
      });
  }, [selectedLocation, key, selectedCategories, selectedAreas]);

  const [page, setPage] = useState(1);

  const handlePageClick = (action) => {
    if (action === 'prev' && page > 1) {
      setPage(page - 1);
    } else if (action === 'next' && page < 5) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setIsLoading(true)
    setStores({ data: [] })
    const selectedCat = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
    const selectedDistrict = selectedAreas.length > 0
  ? selectedAreas.map(area => area.replace(/(Quận|Huyện)\s+/g, '')).join(',')
  : ''; 
  const api = `https://falth-api.vercel.app/api/store?city=${selectedLocation}&district=${selectedDistrict}&catName=${selectedCat}&limit=12&isLocked=false&page=${page}&search=${key}`
    console.log(api)
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        setStores(data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API', error);
        setIsLoading(false)
      });
  }, [page]);

  return (
    <div>
      <div class="container">
        <div class="now-search-filter">
          <div class="nav-filter clearfix">
            <div class="list-filter">
              <div className={`item-filter ${isOpen ? 'show' : ''}`} ref={dropdownRef}>
                <div
                  class="dropdown-toggle"
                  id="District"
                  role="button"
                  data-toggle="dropdown"
                  tabindex="0"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={handleToggleDropdown}
                >
                  {t("homeArea")}
                </div>
                {isOpen && (
                  <div class="container-box-filter">
                    <div class="content">


                      {districts.map((district) => (
                        <div className="custom-checkbox" key={district.Id}>
                          <input
                            type="checkbox"
                            id={`district-${district.Id}`}
                            checked={selectedAreas.includes(district.Name)}
                            onChange={() => handleAreaChange(district.Name)}
                          />
                          <label htmlFor={`district-${district.Id}`}>{district.Name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={`item-filter ${isOpen1 ? 'show' : ''}`} ref={dropdownRef1}>
                <span className="dropdown-toggle" id="categories" onClick={handleToggleDropdown1}>{t("homeCategory")}</span>
                {isOpen1 && (
                  <div class="container-box-filter">
                    <div class="content">
                      {categories.map((category) => (

                        <div className="custom-checkbox" key={category._id}>
                          <input
                            type="checkbox"
                            id={`category-${category._id}`}
                            checked={selectedCategories.includes(category.catName)}
                            onChange={() => handleCategoryChange(category.catName)}
                          />
                          <label htmlFor={`category-${category._id}`}>{category.catName}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
            {/* <div class="float-right">
              <select class="filter-sort">
                <option value="3">{t("homeSort")}</option>
                <option value="36">{t("homeSort2")}</option>
              </select>
            </div> */}
          </div>
          <div class="tag-filter">
            {key !== "" && (
              <div className="widget-tag">
                {t("homeKey")}: <span className="key-word">{key}</span>
                <span className="btn-delete-tag" onClick={() => handleRemove("key")}>x</span>
              </div>
            )}
            {selectedAreas.length > 0 && (
              <div class="widget-tag">
                {t("homeArea")}: <span class="key-word">({selectedAreas.length})</span>
                <span class="btn-delete-tag" onClick={() => handleRemove("area")}>x</span>
              </div>
            )}
            {selectedCategories.length > 0 && (
              <div class="widget-tag">
                {t("homeCategory")}: <span class="key-word">({selectedCategories.length})</span>
                <span class="btn-delete-tag" onClick={() => handleRemove("cat")}>x</span>
              </div>
            )}
          </div>
        </div>
        <div class="now-list-restaurant res-col-4">
          <div class="list-restaurant">
            <div class="now-loading-restaurant">
              <div class="box-loading">
                <div class="box-thumbnail"></div>
                <div class="box-line-df"></div>
                <div class="box-line-lgx"></div>
                <div class="box-line-lg"></div>
              </div>
            </div>
            {isLoading && Array(4).fill(0).map((item, index) => (
              <div class="item-restaurant" >
                <div class="img-restaurant">
                  <Skeleton />
                </div>
                <div class="info-restaurant">
                  <div class="info-basic-res" style={{ height: '50px', width: '285px' }}>
                    <Skeleton />
                  </div>
                  <p class="content-promotion" style={{ height: '30px', width: '285px' }}>
                    <Skeleton />
                  </p>
                </div>
              </div>
            ))}

            {stores.data.map((store) => (

              <StoreItem
                store={store}
              />
            ))}


          </div>
        </div>
        <ul class="pagination">
          <li class="" onClick={() => handlePageClick('prev')}>
            <button class="no_hover"><i class="fa-solid fa-circle-chevron-left" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
          </li>
          <li className={`${page === 1 ? 'active' : ''}`}
            onClick={() => setPage(1)}><button class="" >1</button></li>
          <li className={`${page === 2 ? 'active' : ''}`}
            onClick={() => setPage(2)}><button class="" >2</button></li>
          <li className={`${page === 3 ? 'active' : ''}`}
            onClick={() => setPage(3)}><button class="" >3</button></li>
          <li className={`${page === 4 ? 'active' : ''}`}
            onClick={() => setPage(4)}><button class="" >4</button></li>
          <li className={`${page === 5 ? 'active' : ''}`}
            onClick={() => setPage(5)}><button class="" >5</button></li>
          <li class="" onClick={() => handlePageClick('next')}>
            <button class="no_hover"><i class="fa-solid fa-circle-chevron-right" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
          </li>
        </ul>
      </div>
    </div>
  )
}
export default Home;
