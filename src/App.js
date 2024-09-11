import React, { useState, useEffect } from 'react';
import './App.css'; // Подключение файла стилей
import axios from 'axios'
import logoImage from './test.png'; // Импорт изображения логотипа из папки src

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // Статус для отображения (error, warning, success)
  const [dateTime, setDateTime] = useState(new Date()); // Состояние для даты и времени
  const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
  const [generatedData, setGeneratedData] = useState([]); // Массив для хранения сгенерированных данных
  const [isGenerated, setIsGenerated] = useState(false); // Состояние для фиксации изменений

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

  // Функция генерации нескольких связанных элементов
  const generateRelatedElements = () => {
    const relatedElements = [
      <div key="group1">
        <button>Press</button>
        <br></br>
        <br></br>
      </div>,
      <div key="group2">
        <table border="1">
          <tbody>
            <tr>
              <td>Table</td>
              <td>Hi, I'm your first cell.</td>
              <td>I'm your second cell.</td>
              <td>I'm your third cell.</td>
              <td>I'm your fourth cell.</td>
            </tr>
            <tr>
              <td>Table</td>
              <td>Hi, I'm your first cell.</td>
              <td>I'm your second cell.</td>
              <td>I'm your third cell.</td>
              <td>I'm your fourth cell.</td>
            </tr>
            <tr>
              <td>Table</td>
              <td>Hi, I'm your first cell.</td>
              <td>I'm your second cell.</td>
              <td>I'm your third cell.</td>
              <td>I'm your fourth cell.</td>
            </tr>
          </tbody>
        </table>
        <br></br>
      </div>,
      <div key="group3">
        <input type="text" placeholder="Введите текст" />
      </div>,
    ];
    // Возвращаем все элементы как одну связанную группу
    return relatedElements;
  };

  // Обработчик для кнопки "Отправить на согласование"
  const handleSendForApproval = (index) => {
    console.log(`Запрос с индексом ${index} отправлен на согласование.`);
    
    // Отправляем POST-запрос на сервер с ботом
    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Тестовое сообщение!' }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Сообщение отправлено:', data.message);
      } else {
        console.error('Ошибка при отправке сообщения:', data.error);
      }
    })
    .catch((error) => {
      console.error('Ошибка при отправке сообщения:', error);
    });
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Запрос', inputValue);

    axios({
          method: 'post',
          url: 'http://127.0.0.1:5000/api/main',

          data: {text: inputValue}
          ,
        })
        .then(
        function(response) {
          console.log('Ответ сервера успешно получен!');
          axios.get('http://127.0.0.1:5000/api/main').then(r => {console.log('Информация с модели', r.data)});}
        )
        .catch(function(error) {
          console.log(error);
        });


    // Запускаем загрузку
    setIsLoading(true);

    // Имитация задержки 0.5 секунд перед генерацией элементов
    setTimeout(() => {
      setIsLoading(false);

      // Добавляем новую сгенерированную группу элементов в массив
      setGeneratedData((prevData) => [
        ...prevData,
        {
          content: generateRelatedElements(),
          description: `Описание для запроса: ${inputValue}`, // Пример описания, можно заменить
        },
      ]);

      // Очищаем поле ввода
      setInputValue('');

      // Изменяем состояние для отображения нового хедера
      setIsGenerated(true);
    }, 500); // 0.5 секунд
  };

  return (
    <div className={`App ${isGenerated ? 'fixed' : 'initial'}`}>
      {/* Фиксированная верхняя часть */}
      <div className={`header-container ${isGenerated ? 'generated-header' : 'initial-header'}`}>
        {!isGenerated && (
          <img src={logoImage} alt="My Image" className="header-image" />
        )}
        {isGenerated && (
          <div className="header-left">
            <a href="http://localhost:3000/">
              <img src={logoImage} alt="Logo" className="header-logo" />
            </a>
          </div>
        )}
        <div className="header-center">
          {!isGenerated && <h1>HLMK Corporate Page Generator</h1>} {/* Убираем текст после генерации */}
          <br></br>
          <form onSubmit={handleSubmit} className="input-wrapper">
            <input
              type="text"
              placeholder="Введите запрос для генерации"
              value={inputValue}
              onChange={handleInputChange}
              className={`text-field ${status}`} // Добавляем классы для состояний
            />
            <button type="submit" className="confirm-button">
              Подтвердить
            </button>
          </form>
        </div>
        {isGenerated && (
          <div className="header-right">
            <div className="date-time">{dateTime.toLocaleString()}</div> {/* Отображение даты и времени */}
          </div>
        )}
      </div>

      {/* Прокручиваемая область для сгенерированных данных */}
      <div className="generated-results-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Отображение всех сгенерированных элементов и описаний */}
        <div className="generated-results">
          {generatedData.map((data, index) => (
            <div key={index} className="generated-item">
              {data.content.map((element, i) => (
                <div key={i}>{element}</div>
              ))}
              {/* Футер карточки */}
              <div>
                <p className="generated-description">{data.description}</p>
                <br></br>
                <button onClick={() => handleSendForApproval(index)} type="submit" className="confirm-button" >Отправить на согласование</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
