import React, { useRef, useState } from 'react'; // Импортируем useState
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const nameRef = useRef(null);
    const descriptionRef = useRef(null); // Добавляем ref для описания
    const navigate = useNavigate();
    const [error, setError] = useState(null); // Состояние для хранения информации об ошибке

    // Функция добавления правила
    const handleSubmit = (e) => {
        e.preventDefault();
        const newItemData = {
            name: nameRef.current.value,
            description: descriptionRef.current.value, // Добавляем описание в данные нового правила
        };

        axios.post("http://localhost:5000/items", JSON.stringify(newItemData), {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                console.log("Добавленное правило:", response.data);
                navigate('/');
            })
            .catch(error => {
                console.error("Ошибка создания:", error);
                setError("Не удалось добавить правило. Возможно, сервер базы данных выключен.");
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение сообщения об ошибке */}
            <label>
                Название:
                <input type="text" ref={nameRef} required />
            </label>
            <br />
            <label>
                Описание:
                <textarea ref={descriptionRef} /> {/* Поле для ввода описания */}
            </label>
            <br />
            <button type="submit">Добавить</button>
            <Link to="/">
                <button type="button">Вернуться на главную</button> {/* Кнопка для возврата на главную */}
            </Link>
        </form>
    );
};

export default Form;
