import { useState, useEffect } from 'react';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=5ea42efa67baf3658e1150578579ae00`;

  // Function to convert Fahrenheit to Celsius
  const convertToCelsius = (tempF) => {
    return ((tempF - 32) * (5 / 9)).toFixed(1); // Round to 1 decimal place
  };

  const fetchWeather = () => {
    setIsLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        setError('');
        setIsLoading(false);
      })
      .catch((err) => {
        setData({});
        setError('Location is not valid');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (location) {
      const timer = setTimeout(() => {
        fetchWeather();
        setIsTyping(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="app">
      <div className="container">
        <div className="search">
          <input
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setIsTyping(true);
              setError('');
            }}
            placeholder="Enter Location"
            type="text"
          />
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BeatLoader color="white" loading={isLoading} />
          </div>
        ) : (
          <div>
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                {data.main ? (
                  <h1>{convertToCelsius(data.main.temp)}°C</h1>
                ) : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>

            {data.name && !error && (
              <div className="bottom">
                <div className="feels">
                  <p>Feels Like</p>
                  {data.main ? (
                    <p className="bold">{convertToCelsius(data.main.feels_like)}°C</p>
                  ) : null}
                </div>
                <br />
                <div className="humidity">
                  <p>Humidity</p>
                  {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
                </div>
                <br />
                <div className="wind">
                  <p>Wind Speed</p>
                  {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
