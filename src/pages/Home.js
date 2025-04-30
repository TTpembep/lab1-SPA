import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/rules");
        setData(response.data);
      } catch (error) {
        setError("Ошибка загрузки информации. Нет ответа от базы данных.");
      }
    };

    loadData();
  }, []);

  const handleDeleteItem = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/rules/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      setError("Ошибка удаления. Нет ответа от базы данных.");
    }
  }, [data]);

  const sortedProducts = useMemo(() => {
    return data.sort((a, b) => a.type.localeCompare(b.type));
  }, [data]);

  return (
    <div className="App">
      <h1>Справочник автобезопасности.</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FilterableProductTable products={sortedProducts} onDeleteItem={handleDeleteItem} />
      <br /><br /><br />
      <p><Link to="/add">Добавить правило</Link></p>
      <br /><hr /><br />
    </div>
  );
};

const FilterableProductTable = ({ products, onDeleteItem }) => {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <ProductTable products={products} filterText={filterText} onDeleteItem={onDeleteItem} />
    </div>
  );
};

const ProductCategoryRow = ({ category }) => (
  <tr>
    <th colSpan="3">{category}</th>
  </tr>
);

const ProductRow = ({ product, onDeleteItem }) => (
  <tr>
    <td>
      <li><Link to={`/detail/${product.id}`}>{product.name}</Link></li>
    </td>
    <td>{product.description}</td>
    <td>
      <button onClick={() => onDeleteItem(product.id)}>Удалить</button>
    </td>
  </tr>
);

const ProductTable = ({ products, filterText, onDeleteItem }) => {
  const rows = useMemo(() => {
    let lastCategory = null;
    return products
      .filter(product => product.name.toLowerCase().includes(filterText.toLowerCase()))
      .reduce((rows, product) => {
        if (product.type !== lastCategory) {
          rows.push(<ProductCategoryRow key={product.type} category={product.type} />);
        }
        rows.push(<ProductRow key={product.id} product={product} onDeleteItem={onDeleteItem} />);
        lastCategory = product.type;
        return rows;
      }, []);
  }, [products, filterText, onDeleteItem]);

  return (
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Описание</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const SearchBar = ({ filterText, onFilterTextChange }) => (
  <form>
    <input
      type="text"
      value={filterText}
      placeholder="Search..."
      onChange={(e) => onFilterTextChange(e.target.value)}
    />
  </form>
);

/*const ProductList = ({ products, onDeleteItem }) => (
  <ul>
    {products.map(item => (
      <li key={item.id}>
        <Link to={`/detail/${item.id}`}>{item.name}</Link>
        <button onClick={() => onDeleteItem(item.id)}>Удалить</button>
      </li>
    ))}
  </ul>
);*/

export default Home;
