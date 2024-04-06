// import { useState } from "react";

// const Weather = () => {
//   const [query, setQuery] = useState("");

//   const [weather, setWeather] = useState({});

//   const api = {
//     key: "bbf8f01a167651a276d3de876de8172b",
//     base: "https://api.openweathermap.org/data/2.5/",
//   };

//   const search = (evt) => {
//     if (evt.key === "Enter") {
//       fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
//         .then((res) => res.json()) // Corrected invocation of res.json()
//         .then((result) => {
//           setWeather(result);
//           setQuery("");
//           console.log(weather);
//         });
//     }
//   };

//   const dateBuilder = (d) => {
//     let months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     let days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     let day = days[d.getDay()];
//     let date = d.getDate();
//     let month = months[d.getMonth()];
//     let year = d.getFullYear();

//     return `${day} ${date} ${year}`;
//   };
//   return (
//     <div>
//       <main>
//         <div className="search-box">
//           <input
//             type="text"
//             className="search-bar"
//             placeholder="Search..."
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={search}
//           />
//         </div>
//         <div>
//           <div className="location-box">
//             <div className="location">
//               {weather.name},{weather.sys.country}
//               <div className="date">{dateBuilder(new Date())}</div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Weather;


import  { useState, useEffect } from "react";
import './Weather.css'

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const api = {
    key: "bbf8f01a167651a276d3de876de8172b",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return; // Avoid making unnecessary API calls
      
      try {
        const response = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
        const result = await response.json();
        setWeather(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [query]); // Run effect when query changes

  const dateBuilder = (d) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <div className={(typeof weather.main!="undefined") ? ((weather.main.temp>16)?'app-warm':'app'):'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setQuery(e.target.value);
              }
            }}
          />
        </div>
        {weather.name && (
        <div className="location-box">
            <div className="location">
              {weather.name}, {weather.sys.country}
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
                <div className="temp">
                    {Math.round(weather.main.temp)}°C
                </div>
                <div className="weather">
                    {weather.weather[0].main}
                </div>
            </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default Weather;
