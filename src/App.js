import React, { useState, useEffect } from 'react';
import './App.css';
import logoImage from './test.png';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');

  const [dateTime, setDateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Состояние для управления Pop-up окном
  const [comment, setComment] = useState(''); // Для хранения комментария

  const updateDateTime = () => {
    setDateTime(new Date());
  };

  useEffect(() => {
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);

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

  const generateRelatedElements = () => {
    const relatedElements = [
      <body>
        <header>
          <h1>Личный сайт</h1>
          <p>Который сделан на основе готового шаблона</p>
          <nav>
            <ul>
              <li><a href="index.html">Эта страница</a></li>
              <li><a href="catalog.html">Другая страница</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <section>
              <h2>Первая секция</h2>
              <p>Она обо мне</p>
              <p>Но может быть и о семантике, я пока не решил.</p>
            </section>
            <section>
              <h2>Вторая секция</h2>
              <p>Она тоже обо мне</p>
            </section>
            <section>
              <h2>И третья</h2>
              <p>Вы уже должны были начать догадываться.</p>
            </section>
          </article>
        </main>
        <footer>
          <p>Сюда бы я вписал информацию об авторе и ссылки на другие сайты</p>
        </footer>
        сюда можно подключить jquery <script src="scripts/app.js" defer></script>
      </body>
      ,
    ];
    return relatedElements;
  };

  const handleSendForApproval = (index) => {
    // Показываем Pop-up окно при нажатии
    setShowPopup(true);
  };

  const handleSubmitComment = () => {
    // Отправляем комментарий на сервер Telegram-бота
    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: comment }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Комментарий отправлен:', data.message);
        } else {
          console.error('Ошибка при отправке комментария:', data.error);
        }
        setShowPopup(false); // Закрываем Pop-up после успешной отправки
        setComment(''); // Очищаем поле комментария
      })
      .catch((error) => {
        console.error('Ошибка при отправке комментария:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Отправленный запрос:', inputValue);

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      setGeneratedData((prevData) => [
        ...prevData,
        {
          content: generateRelatedElements(),
          description: `Описание для запроса: ${inputValue}`,
        },
      ]);

      setInputValue('');
      setIsGenerated(true);
    }, 1500);
  };

  return (
    <div className={`App ${isGenerated ? 'fixed' : 'initial'}`}>
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
          {!isGenerated && <h1>HLMK Corporate Page Generator</h1>}
          <br></br>
          <form onSubmit={handleSubmit} className="input-wrapper">
            <input
              type="text"
              placeholder="Введите запрос для генерации"
              value={inputValue}
              onChange={handleInputChange}
              className={`text-field ${status}`}
            />
            <button type="submit" className="confirm-button">
              Подтвердить
            </button>
          </form>
        </div>
        {isGenerated && (
          <div className="header-right">
            <div className="date-time">{dateTime.toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="generated-results-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="generated-results">
          {generatedData.map((data, index) => (
            <div key={index} className="generated-item">
              <div className="generated-content-block">
                {data.content.map((element, i) => (
                  <div key={i}>{element}</div>
                ))}
              </div>
              <div className="generated-description-block">
                <p className="generated-description">{data.description}</p>
                <br></br>
                <button onClick={() => handleSendForApproval(index)} type="submit" className="confirm-button">
                  Отправить на согласование
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up для ввода комментария */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Введите комментарий</h2>
            <br></br>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input-popup"
              placeholder="Введите комментарий"
            />
            <br></br>
            <button onClick={handleSubmitComment} className="confirm-button">
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
