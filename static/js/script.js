let currentCity = "";
let currentUnit = "c";
let hourlyOrWeek = "week";

// hàm này tự động lấy dữ liệu thời tiết của HÀ Nội, load trang lần đầu tiên sẽ gọi hàm này
function initFetchDataDefault() {
    getWeatherData("hanoi", "c", hourlyOrWeek);
}
initFetchDataDefault();

// function to get weather data
function getWeatherData(city, unit, hourlyOrWeek) {
    console.log(city, unit, hourlyOrWeek);
    fetch(
        `${API_URL}/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`,
        { method: "GET", headers: {} }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let today = data.currentConditions;
            if (unit === "c") {
                TEMP.innerText = today.temp;
            } else {
                TEMP.innerText = CToF(today.temp);
            }
            CURRENT_LOCATION.innerText = data.resolvedAddress;
            CONDITION.innerText = today.conditions;
            RAIN.innerText = "Perc - " + today.precip + "%";
            UV_INDEX.innerText = today.uvindex;
            WIND_SPEED.innerText = today.windspeed;
            measureUvIndex(today.uvindex);
            MAIN_ICON.src = getIcon(today.icon);
            changeBackground(today.icon);
            changeLocationBackground(city)
            HUMIDITY.innerText = today.humidity + "%";
            updateHumidityStatus(today.humidity);
            VISIBILITY.innerText = today.visibility;
            updateVisibilityStatus(today.visibility);
            AIR_QUALITY.innerText = today.winddir;
            updateAirQualityStatus(today.winddir);
            if (hourlyOrWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
            console.log(today.sunrise)
            console.log(today.sunset)
            SUN_RISE.innerText = covertTimeTo12HourFormat(today.sunrise);
            SUN_SET.innerText = covertTimeTo12HourFormat(today.sunset);
        })
        .catch((err) => {
            alert("City not found in our database");
        });
}

//hàm xử lý dự báo thời tiết 7 ngày
function updateForecast(data, unit, type) {
    WEATHER_CARDS.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = CToF(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
            <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  		`;
        WEATHER_CARDS.appendChild(card);
        day++;
    }
}

// thay đổi icon theo tình trạng
function getIcon(condition) {
    switch (condition) {
        case "partly-cloudy-day":
            return "static/img/27.png";
        case "partly-cloudy-night":
            return "static/img/15.png";
        case "rain":
            return "static/img/39.png";
        case "clear-day":
            return "static/img/26.png";
        case "clear-night":
            return "static/img/10.png";
        default:
            return "static/img/26.png";
    }
}

// thay doi hinh nen theo thoi tiet
function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    switch (condition) {
        case "partly-cloudy-day":
            bg = "static/img/pc.webp";
        case "partly-cloudy-night":
            bg = "static/img/pcn.jpeg";
        case "rain":
            bg = "static/img/rain.webp";
        case "clear-day":
            bg = "static/img/cd.jpeg";
        case "clear-night":
            bg = "static/img/cn.jpeg";
        default:
            bg = "static/img/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient(rgb(97 97 97 / 50%), rgb(98 97 97 / 50%)),url(${bg})`;
}

function changeLocationBackground(city) {
    console.log("qeq," ,city)
    const body = document.querySelector(".img-location");
    let bg = "";

    fetch(
        `https://api.pexels.com/v1/search?query=${city}&per_page=1`,
        { method: "GET", headers: {
            Authorization: API_PEXELS
        } }
    )
        .then((response) => response.json())
        .then((data) => {
            bg = data.photos[0].src.medium;
            body.style.backgroundImage = `linear-gradient(rgb(60 60 60 / 50%), rgb(60 60 60 / 50%)),url(${bg})`;
        })
        .catch((err) => {
            alert("City not found in our database");
        });
}

// xử lý giờ, hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// xử lý thời gian, convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// lấy tên của ngày (moday, tuesday, ...)
function getDayName(date) {
    let day = new Date(date);
    return DAYS[day.getDay()];
}

// Hàm lấy xử lý tia UV
function measureUvIndex(uvIndex) {
    switch (true) {
        case uvIndex <= 2:
            UV_TEXT.innerText = "Low";
            break;
        case uvIndex <= 5:
            UV_TEXT.innerText = "Moderate";
            break;
        case uvIndex <= 7:
            UV_TEXT.innerText = "High";
            break;
        case uvIndex <= 10:
            UV_TEXT.innerText = "Very High";
            break;
        default:
            UV_TEXT.innerText = "Extreme";
    }
}

// hàm xử lý trạng thái của độ ẩm
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        HUMIDITY_STATUS.innerText = "Low";
    } else if (humidity <= 60) {
        HUMIDITY_STATUS.innerText = "Moderate";
    } else {
        HUMIDITY_STATUS.innerText = "High";
    }
}

// hàm xử lý trạng thái của tầm nhìn (Visibility)
function updateVisibilityStatus(visibility) {
    switch (true) {
        case visibility <= 0.03:
            VISIBILITY_STATUS.innerText = "Dense Fog";
            break;
        case visibility <= 0.16:
            VISIBILITY_STATUS.innerText = "Moderate Fog";
            break;
        case visibility <= 0.35:
            VISIBILITY_STATUS.innerText = "Light Fog";
            break;
        case visibility <= 1.13:
            VISIBILITY_STATUS.innerText = "Very Light Fog";
            break;
        case visibility <= 2.16:
            VISIBILITY_STATUS.innerText = "Light Mist";
            break;
        case visibility <= 5.4:
            VISIBILITY_STATUS.innerText = "Very Light Mist";
            break;
        case visibility <= 10.8:
            VISIBILITY_STATUS.innerText = "Clear Air";
            break;
        default:
            VISIBILITY_STATUS.innerText = "Very Clear Air";
    }
}

// Hàm xử lý lượng mưa
function updateAirQualityStatus(quality) {
    switch (true) {
        case quality <= 50:
            AIR_QUALITY_STATUS.innerText = "Good👌";
            break;
        case quality <= 100:
            AIR_QUALITY_STATUS.innerText = "Moderate😐";
            break;
        case quality <= 150:
            AIR_QUALITY_STATUS.innerText = "Unhealthy for Sensitive Groups😷";
            break;
        case quality <= 200:
            AIR_QUALITY_STATUS.innerText = "Unhealthy😷";
            break;
        case quality <= 250:
            AIR_QUALITY_STATUS.innerText = "Very Unhealthy😨";
            break;
        default:
            AIR_QUALITY_STATUS.innerText = "Hazardous😱";
    }
}

// chuyển từ độ C sang độ F
function CToF(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

// xử lý sự kiện chuyển đổi từ độ c sang f, ngược lại
F_BTN.addEventListener("click", () => {
    changeUnit("f");
});

C_BTN.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        TEMP_UNIT.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            C_BTN.classList.add("active");
            F_BTN.classList.remove("active");
        } else {
            C_BTN.classList.remove("active");
            F_BTN.classList.add("active");
        }
        if (currentCity === "") {
            currentCity = "hanoi";
        }
        console.log(currentCity, currentUnit, hourlyOrWeek);
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    }
}

// xử lý sự kiện chuyển đổi từ hourly hoặc week
HOURLY_BTN.addEventListener("click", () => {
    changeTimeSpan("hourly");
});

WEEK_BTN.addEventListener("click", () => {
    changeTimeSpan("week");
});

function changeTimeSpan(unit) {
    if (hourlyOrWeek !== unit) {
        hourlyOrWeek = unit;
        if (unit === "hourly") {
            HOURLY_BTN.classList.add("active");
            WEEK_BTN.classList.remove("active");
        } else {
            HOURLY_BTN.classList.remove("active");
            WEEK_BTN.classList.add("active");
        }
        if (currentCity === "") {
            currentCity = "hanoi";
        }
        getWeatherData(currentCity, currentUnit, hourlyOrWeek);
    }
}
