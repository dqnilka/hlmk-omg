import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logoImage from './test.png';
import html2canvas from 'html2canvas';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [initialRequest, setInitialRequest] = useState(''); 

  const relatedElementsRef = useRef(); 

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
      <div ref={relatedElementsRef}>
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
        </main>
        <footer>
          <p>Сюда бы я вписал информацию об авторе и ссылки на другие сайты</p>
        </footer>
      </div>
    ];
    return relatedElements;
  };

  const handleSendForApproval = (index) => {
    setShowPopup(true);
  };

  const handleSubmitComment = async () => {
    setIsSending(true);

    const canvas = await html2canvas(relatedElementsRef.current);
    const imageData = canvas.toDataURL('image/png');
    console.log("Отправляем данные на сервер:", { message: comment, initialRequest: initialRequest });

    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: comment,
        image: imageData,
        initialRequest: initialRequest,  
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Комментарий, скриншот и первоначальный запрос отправлены:', data.message);
        } else {
          console.error('Ошибка при отправке:', data.error);
        }
        setIsSending(false);
        setShowPopup(false);
        setComment('');
      })
      .catch((error) => {
        console.error('Ошибка при отправке:', error);
        setIsSending(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setGeneratedData((prevData) => [
        ...prevData,
        {
          content: generateRelatedElements(),
          description: `${inputValue}`,
        },
      ]);
      setInitialRequest(inputValue);  
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
          {generatedData.slice().reverse().map((data, index) => (
            <div key={index} className="generated-item">
              <div className="generated-content-block">
                {data.content.map((element, i) => (
                  <div key={i}>{element}</div>
                ))}
              </div>
              <div className="generated-description-block">
                <p className="generated-description">
                  <span className="bold-text">Описание для запроса:</span> <span className="italic-text">{data.description}</span>
                </p>
                <br></br>
                <button onClick={() => handleSendForApproval(index)} className="confirm-button">
                  Отправить на согласование
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {isSending && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="loading-spinner"></div>
            <p>Отправка комментария...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
