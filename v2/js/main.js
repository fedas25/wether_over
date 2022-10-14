import { storage } from "./storage.js"

let htmlNodes = undefined;

let listCitySet = new Set;
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

const clearDisplay = () => {
  htmlNodes.nowTab.classList.add("dis_none");
  htmlNodes.detailsTab.classList.add("dis_none");
  htmlNodes.forecastTab.classList.add("dis_none");
}

const updateDataNow = (data) => {
  htmlNodes.iconWeather.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
  htmlNodes.temp.innerHTML = Math.round(data.main.temp) + "&deg;";
  htmlNodes.city.innerHTML = data.name;
  storage.updateSelectedCity(data.name);
}

const updateDataDetails = (data) => {
  htmlNodes.cityDetails.innerText = data.name;
  htmlNodes.temperatureDetails.innerHTML = `Temperature: ${Math.round(data.main.temp)}&deg`;
  htmlNodes.feelsLikeDetails.innerHTML = `Feels like: ${Math.round(data.main.feels_like)}&deg`;
  htmlNodes.weatherDetails.innerText = `Weather: ${data.weather[0].description}`;

  const dateSunrise = new Date(Number(data.sys.sunrise + "000"));
  const timeSunrise = dateSunrise.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  htmlNodes.sunriseDetails.innerText = 'Sunrise: ' + ( (timeSunrise.substring(0, 2) == "24") ? `00:${timeSunrise.substring(3)}` : timeSunrise);

  const dateSunset = new Date(Number(data.sys.sunset + "000"));
  const timeSunset = dateSunset.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  htmlNodes.sunsetDetails.innerText = 'Sunset: ' + ( (timeSunset.substring(0, 2) == "24") ? `00:${timeSunset.substring(3)}` : timeSunset);
}

const displaySearchError = () => {
  const changeColorsForm = () => {
    htmlNodes.inputForm.style.color = (htmlNodes.inputForm.style.color === "red") ? "black" : "red";
  }

  for (let i = 1; i < 7; i++) {
    setTimeout(changeColorsForm, i * 120);
  }
}

const cleanInputForm = () => {
  htmlNodes.inputForm.value = "";
}

const getCityData = async (city) => {
  try {
    const urlMainInfo = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const resMainInfo = await fetch(urlMainInfo);
    if (!resMainInfo.ok) throw new Error(resMainInfo.status);
    const dataMainInfo = await resMainInfo.json();

    cleanInputForm();

    updateDataNow(dataMainInfo);
    updateDataDetails(dataMainInfo);

    const urlForecastInfo = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const resForecastInfo = await fetch(urlForecastInfo);
    const dataForecastInfo = await resForecastInfo.json();
    updateDataForecast(dataForecastInfo);

    setIconCityStatus();
  } catch (err) {
    displaySearchError();
  }
}

const citySearch = () => {
  if (htmlNodes.inputForm.value) getCityData(htmlNodes.inputForm.value);
}

const removeCityFromList = (city) => {
  listCitySet.delete(city);
  showCityList();
}

const clearScreenForecast = () => {
  htmlNodes.tabForecast.innerHTML = "";
}

const getContainerForecastForHour = ({ time, data, temperature, feelsLike, iconWeatherSrc }) => {
  const containerForecastForHour = htmlNodes.templateForecastForHour.content.cloneNode(true);
  const forecastForHourTime = containerForecastForHour.querySelector(".time");
  const forecastForHourDate = containerForecastForHour.querySelector(".data");
  const forecastForHourTemperature = containerForecastForHour.querySelector(".temperature");
  const forecastForHourFeelsLike = containerForecastForHour.querySelector(".feels_like");
  const forecastForHourIconWeatherSrc = containerForecastForHour.querySelector(".right_group > img");

  forecastForHourTime.innerText = time;
  forecastForHourDate.innerText = data;
  forecastForHourTemperature.innerHTML = temperature;
  forecastForHourFeelsLike.innerHTML = feelsLike;
  forecastForHourIconWeatherSrc.src = iconWeatherSrc;

  return containerForecastForHour;
}

const updateDataForecast = (data) => {
  clearScreenForecast();

  const pNameMonth = document.querySelector(".forecast > .month");
  pNameMonth.innerText = data.city.name;

  data.list.forEach((itemList) => {
    const date = new Date(itemList.dt_txt);
    const timeValue = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).substring(0, 5);

    const dataForContainerForecastForHour = {
      time: (timeValue.substring(0, 2) == "24") ? `00:${timeValue.substring(3)}` : timeValue,
      data: `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}`,
      temperature: `Temperature: ${Math.round(itemList.main.temp)}&deg`,
      feelsLike: `Feels like: ${Math.round(itemList.main.feels_like)}&deg`,
      iconWeatherSrc: `https://openweathermap.org/img/wn/${itemList.weather[0].icon}@4x.png`
    }

    const containerForecastForHour = getContainerForecastForHour(dataForContainerForecastForHour);

    htmlNodes.tabForecast.append(containerForecastForHour);
  });
}

const clearScreenAddedLocation = (screenAddedLocation) => {
  screenAddedLocation.innerHTML = "";
}

const showCityList = () => {
  storage.updateListCity(listCitySet);

  const screenAddedLocation = document.querySelector(".location");
  clearScreenAddedLocation(screenAddedLocation);
  listCitySet.forEach((item) => {
    const deleteIcon = document.createElement('img');
    deleteIcon.src = "./img/delete_icon.svg";
    
    deleteIcon.addEventListener('click', (event) => {
      const city = event.target.previousSibling.innerText;
      removeCityFromList(city);
      setIconCityStatus();
    })
    
    const div = document.createElement('div');
    const p = document.createElement('p');

    p.textContent = item;

    div.prepend(p);
    div.append(deleteIcon);
    screenAddedLocation.prepend(div);

    div.addEventListener('click', (event) => {
      const city = event.target.innerText;
      getCityData(city);
    })
  });

  setIconCityStatus();
}

const isCityInFavorites = (citiName) => {
  return ((storage.getListCity() == null) || (storage.getListCity() == "null")) ? false : storage.getListCity().includes(citiName);
}

const setFavoritesIcon = (isFavorite) => {
  htmlNodes.editListIcon.setAttribute("src", (isFavorite) ? "./img/favorites_icon_selected.svg" : "./img/favorites_icon.svg");
}

const setIconCityStatus = () => {
  const nowCitiName = document.querySelector(".month").innerText;
  setFavoritesIcon(isCityInFavorites(nowCitiName));
}

const preWorkActions = async () => {

  const {nodes} = await import("./htmlNodes.js");
  htmlNodes = nodes;

  document.addEventListener("keydown", (key) => {
    if (key.code == "Enter") citySearch()
  });

  htmlNodes.searchIcon.addEventListener('click', citySearch);

  for (const item of htmlNodes.menuItems) {
    item.addEventListener('click', (event) => {
      clearDisplay();
      const tegAtrName = event.target.getAttribute("name");
      document.querySelector(`.${tegAtrName}`).classList.remove("dis_none");

      for (const menuItem of htmlNodes.menuItems) {
        menuItem.classList.remove("selected");
      }

      item.classList.add("selected");
    })
  }

  htmlNodes.editListIcon.addEventListener('click', (event) => {
    const cityName = event.target.previousElementSibling.innerText;
    if ( isCityInFavorites(cityName) ) {
      removeCityFromList(cityName);
    } else {
      listCitySet.add(cityName);
    }
    
    showCityList();
  });

  clearDisplay();

  document.querySelector(".now").classList.remove("dis_none");
  document.querySelector('[name="now"]').classList.add("selected");

  if ((storage.getSelectedCity()) && (storage.getSelectedCity() !== 'null')) {
    getCityData(storage.getSelectedCity());
  } else getCityData("Moscow");

  if ((storage.getListCity()) && (storage.getListCity() !== 'null')) {
    listCitySet = new Set(storage.getListCity());
    showCityList();
  }
}

preWorkActions();