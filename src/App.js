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
    return relatedElements;
  };

  const handleSendForApproval = (index) => {
    console.log(`Запрос с индексом ${index} отправлен на согласование.`);
    
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
    }, 500); 
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
              {data.content.map((element, i) => (
                <div key={i}>{element}</div>
              ))}
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
