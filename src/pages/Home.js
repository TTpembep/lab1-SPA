import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./styles.css";

const Home = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/rules");
        setData(response.data);
      } catch (error) {
        setError("Ошибка загрузки информации. Нет ответа от базы данных.");
      } finally {
        setLoading(false);
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
      <FilterableProductTable products={sortedProducts} onDeleteItem={handleDeleteItem} />
      {loading && <div className="spinner"></div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><Link to="/add">Создать правило</Link></p>
      <hr />
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
};

const SearchBar = ({ filterText, onFilterTextChange }) => (
  <form>
    <input
      type="text"
      value={filterText}
      placeholder="Поиск..."
      onChange={(e) => onFilterTextChange(e.target.value)}
    />
  </form>
);

const ProductCategoryRow = ({ category }) => (
  <tr>
    <th colSpan="3" style={{textAlign: "center"}}>{category}</th>
  </tr>
);

const ProductRow = ({ product, onDeleteItem }) => (
  <tr>
    <td>
      <li><Link to={`/detail/${product.id}`}>{product.name}</Link></li>
    </td>
    <td style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
    {product.description}
    </td>
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

const FilterableProductTable = ({ products, onDeleteItem }) => {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <ProductTable products={products} filterText={filterText} onDeleteItem={onDeleteItem} />
    </div>
  );
};

export default Home;