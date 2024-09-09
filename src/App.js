import React, { useState, useEffect } from 'react';
import './App.css'; // Подключение файла стилей
import myImage from './test.png'; // Импорт изображения из папки src

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // Статус для отображения (error, warning, success)
  const [dateTime, setDateTime] = useState(new Date()); // Состояние для даты и времени
  const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
  const [generatedData, setGeneratedData] = useState([]); // Массив для хранения сгенерированных данных
  const [isFixed, setIsFixed] = useState(false); // Состояние для фиксирования элементов наверху

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

    // Запускаем загрузку
    setIsLoading(true);

    // Имитация задержки 0.5 секунд перед показом изображения
    setTimeout(() => {
      setIsLoading(false);

      // Добавляем новое сгенерированное изображение и описание в массив
      setGeneratedData((prevData) => [
        ...prevData,
        {
          image: myImage, // Здесь можно подставить динамически сгенерированное изображение
          description: `Описание для запроса: ${inputValue}`, // Пример описания, можно заменить
        },
      ]);

      // Очищаем поле ввода
      setInputValue('');

      // Закрепляем элементы в верхней части страницы
      setIsFixed(true);
    }, 500); // 0.5 секунд
  };

  return (
    <div className={`App ${isFixed ? 'fixed' : ''}`}>
      {/* Фиксированная верхняя часть */}
      <div className={`header-container ${isFixed ? 'fixed' : ''}`}>
        <div className="date-time">{dateTime.toLocaleString()}</div> {/* Отображение даты и времени */}
        {!isFixed && ( // Фотография отображается только до генерации
          <img src={myImage} alt="My Image" className="header-image" />
        )}
        <h1>HLMK Corporate Page Generator</h1>
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

      {/* Прокручиваемая область для сгенерированных данных */}
      <div className="generated-results-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Отображение всех сгенерированных изображений и описаний */}
        <div className="generated-results">
          {generatedData.map((data, index) => (
            <div key={index} className="generated-item">
              <img src={data.image} alt={`Generated ${index}`} className="generated-image" />
              <p className="generated-description">{data.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
