import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Detail = () => {
    const { id } = useParams();
    const [itemData, setItemData] = useState({ name: '', description: '', type: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/rules/${id}`);
                setItemData(response.data);
            } catch (error) {
                setError("Не удалось загрузить данные. Возможно, сервер базы данных выключен.");
            }
        };

        loadItem();
    }, [id]);

    const nameRef = useRef(null);
    const typeRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.value = itemData.name || '';
        }
        if (typeRef.current) {
            typeRef.current.value = itemData.type || '';
        }
        if (descriptionRef.current) {
            descriptionRef.current.value = itemData.description || '';
        }
    }, [itemData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedItem = {
            name: nameRef.current.value,
            type: typeRef.current.value,
            description: descriptionRef.current.value.trim(),
        };

        //Условия для полей названия и описания
        if (!updatedItem.name.startsWith("Правило ")) {
            setError("Название должно начинаться с 'Правило '.");
            return;
        }

        const description = updatedItem.description;
        if (!/^[a-zа-я]/.test(description) || !description.endsWith('.')) {
            setError("Описание должно начинаться с маленькой буквы и заканчиваться точкой.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/rules/${id}`, updatedItem, {
                headers: { "Content-Type": "application/json" }
            });
            setItemData(response.data);
            setIsEditing(false);
        } catch (error) {
            setError("Ошибка обновления. Нет ответа от базы данных.");
        }
    };

    return (
        <div className="App">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Название:
                        <input type="text" ref={nameRef} required />
                    </label>
                    <label>
                        Тип правила:
                        <select ref={typeRef} required>
                            <option value="Следует">Следует</option>
                            <option value="Запрещено">Запрещено</option>
                        </select>
                    </label>
                    <label>
                        Описание:
                        <textarea ref={descriptionRef} />
                    </label>
                    <button type="submit">Сохранить</button>
                    <text> </text>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Вернуться к описанию
                    </button>
                </form>
            ) : (
                <div>
                    <h1>{itemData.name}</h1>
                    <p>{itemData.type}: {itemData.description}</p>
                    <button onClick={() => setIsEditing(true)}>Редактировать</button>
                    <text> </text>
                    <Link to="/">
                        <button>Вернуться на главную</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Detail;