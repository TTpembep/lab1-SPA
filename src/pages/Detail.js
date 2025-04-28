import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import './styles.css';

const Detail = () => {
    const { id } = useParams();

    const [itemData, setItemData] = useState({ name: '', description: '' }); // Устанавливаем начальное состояние
    const [isEditing, setIsEditing] = useState(false); // Состояние для отслеживания режима редактирования
    const [error, setError] = useState(null); // Состояние для хранения информации об ошибке

    useEffect(() => {
        // Функция для загрузки данных правила
        const loadItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/items/${id}`);
                setItemData(response.data);
                console.log("Загруженное правило:", response.data);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
                setError("Не удалось загрузить данные. Возможно, сервер базы данных выключен.");
            }
        };

        loadItem();
    }, [id]);

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.value = itemData.name || '';
        }
        if (descriptionRef.current) {
            descriptionRef.current.value = itemData.description || '';
        }
    }, [itemData]);

    // Функция обновления правила
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedItem = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };

        try {
            const response = await axios.put(`http://localhost:5000/items/${id}`, updatedItem, {
                headers: { "Content-Type": "application/json" }
            });
            setItemData(response.data);
            console.log("Обновленное правило:", response.data);
            setIsEditing(false); // Выходим из режима редактирования после обновления
        } catch (error) {
            console.error("Ошибка обновления:", error);
            setError("Не удалось обновить правило. Возможно, сервер базы данных выключен.");
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение сообщения об ошибке */}
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Название:
                        <input type="text" ref={nameRef} required />
                    </label>
                    <br />
                    <label>
                        Описание:
                        <textarea ref={descriptionRef} />
                    </label>
                    <br />
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Вернуться к описанию
                    </button> {/* Кнопка для возврата к описанию */}
                </form>
            ) : (
                <div>
                    <h1>{itemData.name}</h1>
                    {itemData.description && <p>{itemData.description}</p>} {/* Отображаем описание, если оно есть */}
                    <button onClick={() => setIsEditing(true)}>Редактировать</button>
                    <Link to="/">
                        <button>Вернуться на главную</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Detail;
