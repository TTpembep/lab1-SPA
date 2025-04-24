import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]); // Используем useState для хранения данных

  useEffect(() => {
    // Функция для загрузки данных
    const loadData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/items");
        setData(response.data);
        console.log("Данные загружены:", response.data);
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
    };

    loadData();
  }, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании

  // Функция для удаления товара
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      console.log(`Правило ${id} удалено`);
      // Обновляем состояние, удаляя товар из списка
      setData(data.filter(item => item.id !== id));
      console.log("Обновленные данные:", data);
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  return (
    <div>
      <h1>Справка по правилам автомобильной безопасности.</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <Link to={`/detail/${item.id}`}>{item.name}</Link>
            <button onClick={() => deleteItem(item.id)} style={{ marginLeft: "10px" }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <Link to="/add">Добавить правило</Link>
    </div>
  );
};

export default Home;
