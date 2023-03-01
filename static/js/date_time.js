// Hàm xử lý lấy ngày giờ
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = DAYS[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

// gắn ngày giờ vào thẻ DATE
DATE.innerText = getDateTime();

// cứ 1000ms thì gán lại ngày giờ
setInterval(() => {
    DATE.innerText = getDateTime();
}, 1000);
