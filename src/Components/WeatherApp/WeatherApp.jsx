import React from "react";
import './WeatherApp.css'
import {useState} from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';


const isMobile = window.matchMedia("(max-width: 768px)").matches;


const WeatherApp = () => {


    let api_key = "a8bc95b3bb0f5d240c2b5eb24a52f160";

    const[wicon,setWicon] = useState(cloud_icon);
    const [showButton, setShowButton] = useState(false);

    const [forecast, setForecast] = useState([]);
    const [showForecast, setShowForecast] = useState(false);
    const [isForecastShown, setIsForecastShown] = useState(false);


    const search = async () =>{
        setShowButton(true);
        const element = document.getElementsByClassName("cityInput")
        if(element[0].value==="")
        {
            return 0;
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;

        let response = await fetch(url);
        let data = await response.json();

        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-rate");
        const temperature = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");
        

        if (response.status === 404) {
            // Отображаем сообщение о том, что город не найден
            console.log('Город не найден');
            return;
          }

        humidity[0].innerHTML = data.main.humidity+" %";
        wind[0].innerHTML = Math.floor(data.wind.speed)+ " km/h";
        temperature[0].innerHTML = Math.floor(data.main.temp)+ "°С";
        location[0].innerHTML = data.name;

        if(data.weather[0].icon==="01d" || data.weather[0].icon==="01n")
        {
            setWicon(clear_icon);
        }
        else if (data.weather[0].icon==="02d" || data.weather[0].icon==="02n")
        {
            setWicon(cloud_icon);
        }
        else if (data.weather[0].icon==="03d" || data.weather[0].icon==="03n")
        {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon==="09d" || data.weather[0].icon==="09n")
        {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon==="10d" || data.weather[0].icon==="10n")
        {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon==="13d" || data.weather[0].icon==="13n")
        {
            setWicon(snow_icon);
        }
        else
        {
            setWicon(clear_icon);
        }
    }

    const fetchForecast = async () => {
        const city = document.getElementsByClassName("cityInput")[0].value;
        if (!city) return;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=Metric&appid=a8bc95b3bb0f5d240c2b5eb24a52f160`;
        const response = await fetch(forecastUrl);
        const data = await response.json();
        if (data.cod === "200") {
            // Фильтрация данных по времени 15:00
            const filteredData = data.list.filter(item => {
                return item.dt_txt.includes("09:00:00");
            });
            setForecast(filteredData);
            setShowForecast(true);
        } else {
            console.log('Проблема с получением данных прогноза');
        }
    };

    const toggleForecast = async () => {
        if (!isForecastShown) {
            await fetchForecast();  // Загрузка данных, если они еще не загружены
        }
        setIsForecastShown(!isForecastShown);  // Переключение состояния отображения
    };
    

    return (
        <div className="container">
            <div className="top-bar">

            <input
            type="text"
            className="cityInput"
            placeholder="Search"
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                search(event);
                }
            }}
            />

                <div className="search-icon" onClick={()=>{search()}}>
                    <img src={search_icon} alt="" />
                </div>
            </div>
            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            <div className="weather-temp">24c</div>
            <div className="weather-location">london</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="humidity-percent">64%</div>
                        <div className="text">Влажность</div>
                    </div>
                </div>

                {showButton && <div className="button" onClick ={toggleForecast}>{isForecastShown ? "Спрятать" : "Подробнее"}</div>}

                <div className="element">
                    <img src={wind_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="wind-rate">18 km/h</div>
                        <div className="text">Ветер</div>
                    </div>
                </div>
            </div>

            <div className={`forecast-container ${isForecastShown ? 'show' : ''}`}>

                <div className="forecast-row">
                    <div className="forecast-header">Дата</div>
                    {forecast.map((item, index) => (
                        <div key={index} className="forecast-cell">
                            {new Date(item.dt * 1000).toLocaleDateString()}
                        </div>
                    ))}
                </div>
                <div className="forecast-row">
                    <div className="forecast-header">Температура</div>
                    {forecast.map((item, index) => (
                        <div key={index} className="forecast-cell">
                            {item.main.temp.toFixed(1)}°C
                        </div>
                    ))}
                </div>
                <div className="forecast-row">
                    <div className="forecast-header">Влажность</div>
                    {forecast.map((item, index) => (
                        <div key={index} className="forecast-cell">
                            {item.main.humidity}%
                        </div>
                    ))}
                </div>
                <div className="forecast-row">
                    <div className="forecast-header">Ветер</div>
                    {forecast.map((item, index) => (
                        <div key={index} className="forecast-cell">
                            {item.wind.speed.toFixed(1)} km/h
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default WeatherApp