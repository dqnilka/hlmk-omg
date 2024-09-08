import React, { useState, useEffect } from 'react';
import './App.css'; // Подключение файла стилей
import myImage from './test.png'; // Импорт изображения из папки src

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // Статус для отображения (error, warning, success)
  const [dateTime, setDateTime] = useState(new Date()); // Состояние для даты и времени

  // Функция для обновления даты и времени
  const updateDateTime = () => {
    setDateTime(new Date());
  };

  // Обновление даты и времени каждую секунду
  useEffect(() => {
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);

    // Пример логики для изменения статуса
    if (event.target.value.length > 10) {
      setStatus('success');
    } else if (event.target.value.length > 5) {
      setStatus('warning');
    } else if (event.target.value.length > 0) {
      setStatus('error');
    } else {
      setStatus('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Отправленный запрос:', inputValue);
  };

  return (
    <div className="App">
      <div className="date-time">
        {dateTime.toLocaleString()} {/* Отображение даты и времени */}
      </div>
      <div className="container">
        <img src={myImage} alt="My Image" className="header-image" /> {/* Добавляем изображение */}
        <h1>HLMK Corporate Page Generator</h1>
        <br></br>
        <br></br>
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input
            type="text"
            placeholder="Введите запрос для генерации"
            value={inputValue}
            onChange={handleInputChange}
            className={`text-field ${status}`} // Добавляем классы для состояний
          />
        <br></br>
        <br></br>
          <button type="submit" className="confirm-button">
            Подтвердить
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
