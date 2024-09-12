import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import logoImage from './logo.svg';
import html2canvas from 'html2canvas';
import { Avatar, Button, File, Select, Spinner } from '@nlmk/ds-2.0';
import { io } from "socket.io-client";

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
  const [sendingData, setSendingData] = useState(null);

  const relatedElementsRef = useRef();

  const relatedElements = useMemo(() => (
    <div ref={relatedElementsRef}>
      <Avatar userName="Иван" userSurname="Иванов" />
      <br />
      <File label="Прикрепите файл" />
      <br />
      <Select
        options={[
          { value: 'male', label: 'Мужской' },
          { value: 'female', label: 'Женский' }
        ]}
        label="Пол"
        selected={[]}
        onSelectionChange={() => { }}
      />
      <br />
      <Button style={{ backgroundColor: 'blue', color: 'white' }}>
        Сдать ответ
      </Button>
    </div>
  ), []);

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

  const handleSendForApproval = (messageId) => {
    const dataToSend = generatedData.find(data => data.messageId === messageId);
    setSendingData(dataToSend);
    setShowPopup(true);
  };

  const handleSubmitComment = async () => {
    setIsSending(true);

    const canvas = await html2canvas(relatedElementsRef.current);
    const imageData = canvas.toDataURL('image/png');
    console.log("Отправляем данные на сервер:", { message: comment, initialRequest: sendingData?.description });

    fetch('http://localhost:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: comment,
        image: imageData,
        initialRequest: sendingData?.description,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Комментарий, скриншот и первоначальный запрос отправлены:', data.message);
          const messageId = data.message_id;

          setGeneratedData(prevData => prevData.map(d =>
            d.messageId === sendingData.messageId
              ? { ...d, messageId: messageId, rating: { like: 0, dislike: 0 } }
              : d
          ));
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
      const messageId = Date.now();

      setIsLoading(false);
      setGeneratedData((prevData) => [
        ...prevData,
        {
          description: `${inputValue}`,
          messageId: messageId,
          rating: { like: 0, dislike: 0 },
        },
      ]);
      setInitialRequest(inputValue);
      setInputValue('');
      setIsGenerated(true);
    }, 1500);
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log("WebSocket соединение установлено");
    });

    socket.on('rating_update', (parsedData) => {
      console.log("Получены данные через WebSocket:", parsedData);

      setGeneratedData(prevData => {
        return prevData.map(data => {
          console.log(`Соответствие message_id: ${data.messageId} и WebSocket message_id: ${parsedData.message_id}`);
          if (data.messageId === parsedData.message_id) {
            console.log(`Обновляем рейтинг для сообщения с ID ${parsedData.message_id}. Тип рейтинга: ${parsedData.rating}`);
            return {
              ...data,
              rating: {
                like: parsedData.rating === 'like' ? (data.rating.like + 1) : data.rating.like,
                dislike: parsedData.rating === 'dislike' ? (data.rating.dislike + 1) : data.rating.dislike,
              }
            };
          }
          return data;
        });
      });
    });

    socket.on('disconnect', () => {
      console.log("WebSocket соединение закрыто");
    });

    return () => {
      socket.disconnect();
    };
  }, []);


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
          {!isGenerated && <h1>НЛМК Corporate Page Generator</h1>}
          <br />
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
            <Spinner size="l" />
          </div>
        )}

        <div className="generated-results">
          {generatedData.slice().reverse().map((data, index) => (
            <div key={index} className="generated-item">
              <div className="generated-content-block">
                {relatedElements}
              </div>
              <div className="generated-description-block">
                <p className="generated-description">
                  <span className="bold-text">Описание для запроса:</span> <span className="italic-text">{data.description}</span>
                </p>
                <br />
                <button onClick={() => handleSendForApproval(data.messageId)} className="confirm-button">
                  Отправить на согласование
                </button>
                <p>
                  <br></br>
                  <b>Согласовано:</b> {data.rating?.like ?? 0} | <b>Отказано:</b> {data.rating?.dislike ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Введите комментарий</h2>
            <br />
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input-popup"
              placeholder="Введите комментарий"
            />
            <br />
            <button onClick={handleSubmitComment} className="confirm-button">
              Отправить
            </button>
          </div>
        </div>
      )}

      {isSending && (
        <div className="loading-overlay">
          <Spinner size="l" />
        </div>
      )}
    </div>
  );
}

export default App;
