
window.onload = async function() {

    // 시간설정
    var at = [3, 1];

    // 학교 수업 시간
    const ctl = {
        8: 40,
        9: 40,
        10: 40,
        11: 40,
        13: 30,
        14: 30,
        15: 40,
    };
    const ctl_n = Object.keys(ctl);

    $('#notice_msg').html(`
        사이트를 열어두시면<br/>
        수업시간 ${at}분전마다<br/>
        알림을 받을 수 있습니다.`
    );
    
    setInterval(async function() {
        var d = new Date();
        var week = d.getDay(); // 일요일부터 0~6
        var hour = d.getHours().toString();
        var min = d.getMinutes();
        var sec = d.getSeconds();

        // 토일요일 제거
        if (week !== 0 || week !== 6) {
            // 반목문 사용
            for (i in ctl) {
                if (hour === i) {
                    for (j in at) {
                        if (min === (ctl[i]-at[j]) && sec === 0) {
                            var t = ctl_n.indexOf(hour) + 1;
                            return await notify({hour: hour, min: min, at: at[j], t: t});
                        }
                    }
                }
            }
        }
    }, 1000);
}

async function notify({hour = '8', min = 37, at = 3, t = 1, audio = "/sounds/notice.mp3", test = false}) {
    // 맵 설정
    var audioMap = new Map();
    /*
        toast-top-right
        toast-top-center
        toast-top-left
        toast-top-full-width
        toast-bottom-right
        toast-bottom-left
        toast-bottom-center
        toast-bottom-full-width
    */

    toastr.options = {
        "positionClass": "toast-top-right", // 메세지 포지션
        "newestOnTop": false, // 새로운 메세지 위쪽에서 나오게 설정
        "debug": false, // 디버그 (콘솔출력)
        "preventDuplicates": false, //메세지 중복 허용
        "onclick": null, // 클릭했을때 함수
        "progressBar": true, // 아래쪽 시간바
        "closeButton": true, // 닫는 버튼
        "showEasing": "swing", // 애니메이션
        "hideEasing": "linear", // 애니메이션
        "showMethod": "fadeIn", // 애니메이션
        "hideMethod": "fadeOut", // 애니메이션
        "showDuration": "300", // 메세지창의 애니메이션 효과 시간
        "hideDuration": "1000", // 페이드아웃 시간
        "timeOut": "60000", // 메세지 표시시간
        "extendedTimeOut": "10000", // 메세지 위로 커서를 올렸을때 표시시간
        "onHidden": async function() { // 사라졌을때 함수
            audioMap.forEach(async (ado) => {
                await ado.pause();
                ado.currentTime = 0;
            });
        }
    };
    try {
        var text = (test) ? '<br/>(이 알림은<br/>테스트 알림 입니다.)' : '';
        var ado = new Audio(audio);
        audioMap.set('audio', ado);
        await ado.play();
        await toastr.success(
            `현재시간 : ${hour}시 ${min}분${text}`,
            `${t}교시 시작 ${at}분전입니다.`,
        );
        return {
            check: true, 
            option: {
                hour: hour,
                min: min,
                at: at,
                t: t,
                test: test,
                audio: audio
            }
        };
    } catch(err) {
        console.log(err);
        return {
            check: false, 
            option: {
                hour: hour,
                min: min,
                at: at,
                t: t,
                test: test,
                audio: audio
            }
        };
    }
}
