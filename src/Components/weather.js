import React, { useState, useEffect } from 'react';
import './weather.css';
import { FaSearch, FaWind, FaSun, FaMoon } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());

    const API_KEY = "a0212c47eca29e31d0c5e36a4df01a18";

    function handleOnChange(event) {
        setCity(event.target.value);
    }

    async function fetchData() {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        try {
            let response = await fetch(url);
            let output = await response.json();
            if (response.ok) {
                setWeather(output);
                setError('');
            } else {
                setError('No data found. Please enter a valid city name.');
                setWeather(null);
            }
        } catch (error) {
            setError('An error occurred while fetching the data. Please try again later.');
            setWeather(null);
        }
    }

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (weather) {
            document.title = `Weather in ${weather.name}`;
        } else {
            document.title = 'Weather App';
        }
    }, [weather]);

    const formatDateTime = (date) => {
        return date.toLocaleString();
    };


    return (
        <div className={`container ${darkMode ? 'dark' : 'light'}`}>
            <div className='toggle-datetime-container'>
                <button className={`toggle-btn ${darkMode ? 'dark-color' : 'light-color'}`} onClick={handleToggleDarkMode}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
                <div className={`date-time ${darkMode ? 'desc-color' : ''}`}>
                    <p>{formatDateTime(dateTime)}</p>
                </div>
            </div>
            <div className='city'>
                <input
                    type='text'
                    value={city}
                    onChange={handleOnChange}
                    placeholder='Enter Location...'
                />
                <button onClick={fetchData}>
                    <FaSearch />
                </button>
            </div>

            {error && <p className='error-message'>{error}</p>}

            {weather && weather.weather && (
                <div className='content'>
                    <div className='weather-image'>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt=''
                            className='weather-icon'
                        />
                        <h3 className={`desc ${darkMode ? 'desc-color' : ''}`}>{weather.weather[0].description}</h3>
                    </div>

                    <div className='weather-temp'>
                        <h5>{weather.main.temp}<span>&deg;C</span></h5>
                    </div>

                    <div className='weather-city'>
                        <div className='location'>
                            <MdLocationOn />
                        </div>
                        <p className={`${darkMode ? 'desc-color' : ''}`} >{weather.name}, <span>{weather.sys.country}</span></p>
                    </div>

                    <div className='weather-stats'>
                        <div className='wind'>
                            <div className='wind-icon'>
                                <FaWind />
                            </div>
                            <h3 className='wind-speed'>{weather.wind.speed}<span> Km/h</span></h3>
                            <h3 className='wind-heading'>Wind Speed</h3>
                        </div>
                        <div className='humidity'>
                            <div className='humidity-icon'>
                                <WiHumidity />
                            </div>
                            <h3 className='humidity-percent'>{weather.main.humidity}<span> %</span></h3>
                            <h3 className='humidity-heading'>Humidity</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
