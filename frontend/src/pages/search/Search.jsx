import React, { useContext, useEffect, useState } from "react";
import "./search.css";
import { SearchContext, useSearch } from "../../contexts/SearchContext";
import { useLocation, useParams } from "react-router-dom";
import products from "../../assets/data/products";
import ProductsList from "../../components/UI/producslist/ProductsList";
function Search(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const value = searchParams.get("value");
  const [productsData, setProductsData] = useState(products);

  const handleSearch = (e) => {
    if (value) {
      const filteredProduct = products.filter((item) =>
        item.productName.toLowerCase().includes(value.toLowerCase())
      );

      setProductsData(filteredProduct);
    } else {
      setProductsData([]);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [value]);
  return (
    <div className="search__wrapper">
      <div className="heading__page">
        <h1>Tìm kiếm</h1>
        <p className="">
          Có <strong>{productsData.length} sản phẩm</strong>
          cho tìm kiếm
        </p>{" "}
        <h5 className="">
          Kết quả tìm kiếm cho <strong>"{value}"</strong>
        </h5>
      </div>
      <div className="wrapper__content">
        <ProductsList data={productsData} />
      </div>
    </div>
  );
}

export default Search;
