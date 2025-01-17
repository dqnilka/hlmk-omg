import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import logoImage from './logo.svg';
import html2canvas from 'html2canvas';
import {
  Avatar, Button, File, Select, Spinner, Header, ImagePicture, Link, ProgressBar,
  SegmentButtonGroup, Snackbar, Tabs, Typography, Box,
} from '@nlmk/ds-2.0';
import { io } from "socket.io-client";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [components, setComponents] = useState([]);
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

  const fetchComponentsFromServer = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/main', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue }),
      });

      const data = await response.json();
      const { components } = data;

      const generatedComponents = components.map((component, index) => {
        let reactComponent;

        switch (component.type) {
          case 'Avatar':
            reactComponent = <Avatar key={index} {...component.props} />;
            break;
          case 'File':
            reactComponent = <File key={index} {...component.props} />;
            break;
          case 'Header':
            reactComponent = <Header key={index} {...component.props} />;
            break;
          case 'ImagePicture':
            reactComponent = <ImagePicture key={index} {...component.props} />;
            break;
          case 'Link':
            reactComponent = <Link key={index} {...component.props} />;
            break;
          case 'ProgressBar':
            reactComponent = <ProgressBar key={index} {...component.props} />;
            break;
          case 'SegmentButtonGroup':
            reactComponent = <SegmentButtonGroup key={index} {...component.props} />;
            break;
          case 'Snackbar':
            reactComponent = <Snackbar key={index} {...component.props} />;
            break;
          case 'Box':
            reactComponent = <Box key={index} {...component.props} />;
            break;
          case 'Typography':
            reactComponent = <Typography key={index} {...component.props} />;
            break;
          case 'Tabs':
            reactComponent = <Tabs key={index} {...component.props} />;
            break;
          case 'Select':
            reactComponent = <Select key={index} {...component.props} selected={[]} onSelectionChange={() => { }} />;
            break;
          case 'Button':
            reactComponent = <Button key={index} {...component.props}>{component.props.children}</Button>;
            break;
          default:
            reactComponent = null;
        }

        return (
          <React.Fragment key={index}>
            {reactComponent}
            <br />
          </React.Fragment>
        );
      });

      setComponents(generatedComponents);
    } catch (error) {
      console.error('Ошибка при получении данных с сервера:', error);
      // Вы можете добавить обработку ошибки здесь
    }
  };

  const relatedElements = useMemo(() => (
    <div ref={relatedElementsRef}>
      {components.length > 0 ? components : 'some text info'}
    </div>
  ), [components]);

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

  // Изменили функцию handleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await fetchComponentsFromServer(); // Ждем завершения запроса

      const messageId = Date.now();

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
    } catch (error) {
      console.error('Ошибка в handleSubmit:', error);
      // Здесь можно добавить отображение ошибки для пользователя
    } finally {
      setIsLoading(false); // Спиннер остановится после завершения запроса, независимо от результата
    }
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
            <Spinner size="l" color='#3663aaff' />
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
          <Spinner size="l" color='#3663aaff'/>
        </div>
      )}
    </div>
  );
}

export default App;
