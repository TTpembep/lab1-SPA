import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import "./styles.css";

const info = {
  name : 'Служба автобезопасности',
  imageUrl: 'https://shorturl.at/5xnki',
  imageSize: 90,
};

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count +1);
    alert('Всегда соблюдай правила дорожного движения!');
  }

  return (
    <button onClick={handleClick}>
      Нажми на меня!
      <p>Количество нажатий: {count}.</p>
    </button>
  );
}

function AboutPage() {
  return(
    <div className="Base">
      <h2>Информация.</h2>
      <p>Сборник основных правил.<br />Предназначен для закрепления знаний.</p>
      <img 
      className="picture" 
      src={info.imageUrl}
      alt={'Архив ' + info.name}
      style={{
        width: info.imageSize,
        height: info.imageSize
      }}
      />
    </div>
  );
}

const Home = () => {
  const [data, setData] = useState([]); // Используем useState для хранения данных
  const [error, setError] = useState(null); // Состояние для хранения информации об ошибке

  useEffect(() => {
    // Функция для загрузки данных
    const loadData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/items");
        setData(response.data);
        console.log("Данные загружены:", response.data);
      } catch (error) {
        console.error("Ошибка запроса:", error);
        setError("Ошибка загрузки информации. Нет ответа от базы данных.");
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
      setError("Ошибка удаления. Нет ответа от базы данных.");
    }
  };



  return (
    <div className="App">
      <h1>Справочник автобезопасности.</h1>
      <MyButton />
      <br />
      <AboutPage />
      <h2>Совершенно иная кнопка:</h2>
      <MyButton />
      <br /><br /><br />
      <h1>Справка по правилам автомобильной безопасности.</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение сообщения об ошибке */}
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
}

export default Home;