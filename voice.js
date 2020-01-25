let firstTime=true;
$( document ).ready(function() {
const URL = 'voice.php';

function yesFunc(){
    $(".btnYes").css("display", "none");
    $(".btnNo").css("display", "none");
    let pWinApp = document.createElement('p');
    let pWinAppText = document.createTextNode('Yes, I win!:)');
    pWinApp.className="pWinApp";
    pWinApp.appendChild(pWinAppText);
    $(".divRes").append(pWinApp);
}

function noFunc(){
    $(".btnYes").css("display", "none");
    $(".btnNo").css("display", "none");
    let pWinApp = document.createElement('p');
    let pWinAppText = document.createTextNode('OMG, you win!:)');
    pWinApp.className="pWinUser";
    pWinApp.appendChild(pWinAppText);
    $(".divRes").append(pWinApp);
}

$('#speaker').click(function(event){
    
    navigator.mediaDevices.getUserMedia({ audio: true})
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();
            $('#speaker').prop("disabled", true);
            if(firstTime==false){
                $(".divNotFound").remove();
                $(".divFound").remove();
                $(".loading").css("display", "block");
            }

            let audioChunks = [];
            mediaRecorder.addEventListener("dataavailable",function(event) {
                audioChunks.push(event.data);
            });
            
            setTimeout(function(){
                mediaRecorder.stop();
                stream.getTracks().forEach(audioChunks => audioChunks.stop());
                $('#speaker').prop("checked", false);
                $('#speaker').prop("disabled", false);
            }, 5000);
            
            mediaRecorder.addEventListener("stop", function() {
                const audioBlob = new Blob(audioChunks, {
                    type: 'audio/wav'
                });

                let fd = new FormData();
                fd.append('voice', audioBlob);
                sendVoice(fd);
                audioChunks = [];
            });
        });

    async function sendVoice(form) {
        let promise = await fetch(URL, {
            method: 'POST',
            body: form});
        if (promise.ok) {
        let response =  await promise.json();
            $('html, body').animate({
                scrollTop: $("#results").offset().top
            }, 100);
            $(".h2res").css("display", "inline");
            $(".loading").css("display", "block");

            var data = {
                'url': 'https://emocion.lk3.ru/voice/' + response.data,
                'return': 'timecode,apple_music,deezer,spotify',
                'api_token': '2a557e3cb1001117ca1cc2fc31ebf483'
            }
            
            $.getJSON('https://api.audd.io/?jsonp=?', data, function(result){
                firstTime = false;
                if(result.result==null){
                    let notFoundText = document.createElement('p');
                    let notFoundImg = document.createElement('img');
                    let divNotFound = document.createElement('div');
                    divNotFound.className="divNotFound";
                    let text = document.createTextNode("Oops, nothing is found...");
                    notFoundText.appendChild(text);
                    notFoundImg.src= "notfoundimg.png"; 
                    notFoundText.className = "notFoundText";
                    notFoundImg.className = "notFoundImg";
                    $(".loading").css("display", "none");
                    $('#results').append(divNotFound);
                    $('.divNotFound').append(notFoundImg);
                    $('.divNotFound').append(notFoundText);
                }
                else{
                    console.log(result);
                    let img = document.createElement('img');
                    let h4 = document.createElement('h4');
                    let audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src=result.result['deezer']['preview'];
                    audio.className = "audioClass";

                    let divFound = document.createElement('div');
                    divFound.className="divFound";
                    $("#results").append(divFound);

                    let p = document.createElement('p');
                    let ptext = document.createTextNode('This is it?');
                    p.appendChild(ptext);
                    p.className = "pres";
                    let btnYes = document.createElement('button');
                    let btnNo = document.createElement('button');
                    let divRes = document.createElement('div');
                    let btnYesText = document.createTextNode('Yes');
                    btnYes.appendChild(btnYesText);
                    let btnNoText = document.createTextNode('No');
                    btnNo.appendChild(btnNoText);
                    btnYes.className = "btnYes";
                    btnNo.className = "btnNo";
                    divRes.className = "divRes";
                    btnYes.onclick=yesFunc;
                    btnNo.onclick=noFunc;

                    h4.textContent = result.result['artist'] + " - " + result.result['title'];
                    img.src = result.result['deezer']['album']['cover_medium'];
                    img.className = "resultImg";
                    h4.className = "resultText";
                    $(".loading").css("display", "none");
                    $('.divFound').append(img);
                    $('.divFound').append(h4);
                    if(result.result['deezer']['preview']==""){
                        let cantplay = document.createElement('p');
                        let ctext = document.createTextNode("Sorry, I can\'t play this song :(");
                        let a = document.createElement('a');
                        a.href = result.result['deezer']['link'];
                        let atext=document.createTextNode("But you can listen it here");
                        a.appendChild(atext);
                        cantplay.appendChild(ctext);
                        $(".divFound").append(cantplay);
                        $(".divFound").append(a);
                    } else {
                        $('.divFound').append(audio);
                    }
                    $(".divFound").append(divRes);
                    $(".divRes").append(p);
                    $(".divRes").append(btnYes);
                    $(".divRes").append(btnNo);
                } 
            });
        }
    }
});
});