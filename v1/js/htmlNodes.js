const nodes = {
    inputForm: document.querySelector(".input_form > input"),
    templateForecastForHour: document.querySelector("#tmp_forecast_for_hour"),
    tabForecast: document.querySelector(".hourly_forecasts"),
    temp: document.querySelector(".temperature"),
    city: document.querySelector(".month"),
    iconWeather: document.querySelector(".icon-weather"),
    editListIcon: document.querySelector('img[alt="edit_list_icon"]'),
    searchIcon: document.querySelector(".input_form > img"),
    menuItems: document.querySelectorAll(".menu_item"),
    nowTab: document.querySelector(".now"),
    detailsTab: document.querySelector(".details"),
    forecastTab: document.querySelector(".forecast"),
    cityDetails: document.querySelector(".details > .month"),
    temperatureDetails: document.querySelector('[name="Temperature"]'),
    feelsLikeDetails: document.querySelector('[name="Feels like"]'),
    weatherDetails: document.querySelector('[name="Weather"]'),
    sunriseDetails: document.querySelector('[name="Sunrise"]'),
    sunsetDetails: document.querySelector('[name="Sunset"]')
}

export { nodes }