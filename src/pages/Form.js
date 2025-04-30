import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Следует', // Default value
        description: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation for name and description
        if (!formData.name.startsWith("Правило ")) {
            setError("Название должно начинаться с 'Правило '.");
            return;
        }

        const description = formData.description.trim();
        if (!/^[a-zа-я]/.test(description) || !description.endsWith('.')) {
            setError("Описание должно начинаться с маленькой буквы и заканчиваться точкой.");
            return;
        }

        axios.post("http://localhost:5000/rules", formData, {
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
        <div className="App">
            <h1>Добавить новое правило</h1>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>
                        Название:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Тип правила:
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="Следует">Следует</option>
                            <option value="Запрещено">Запрещено</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Описание:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit">Добавить</button>
                    <text> </text>
                    <Link to="/">
                        <button type="button">Вернуться на главную</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Form;
