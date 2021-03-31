
document.addEventListener('DOMContentLoaded', function() {
    // 시간을 딜레이 없이 나타내기 위한 선 실행
    // 이후 0.5초에 한번씩 시간을 갱신
    setInterval(realTimer, 500);
});
function realTimer() {
    const nowDate = new Date();
    document.getElementById('realtime').innerHTML = 
        `${
            nowDate.getFullYear()
        }-${
            az(nowDate.getMonth() + 1)
        }-${
            az(nowDate.getDate())
        } ${az(nowDate.getHours())
        }:${
            az(nowDate.getMinutes())
        }:${
            az(nowDate.getSeconds())
        }`;
}

function az(num) {
    return num < 10 ? '0' + num : num;
}
