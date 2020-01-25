 
$(".entersong").on("click", function(event){
    $("#songForm").css("display", "block");
    $(".entersong").css("display", "none");
});

$('#songForm').submit(function(event){
    
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 2000);
    $(".h2res").css("display", "inline");
    $(".loading").css("display", "block");

    var data = {
        'q': $("#song").val(),
        'return': 'timecode,apple_music,deezer,spotify',
        'api_token': '4f3d3d403d3d3831de05275528feeeb2'
    }

    $.getJSON('https://api.audd.io/findLyrics/?jsonp=?', data, function(result){
        console.log(result);
        // for(let i=0;i<result.result.length;i++){
        //   $("#songsList").append(`<li>Song \'${result.result[i]['title']}\' by \'${result.result[i]['artist']}\'</li>`);
        // }
        $(".loading").css("display", "none");
        let h4 = document.createElement('h4');
        h4.textContent = result.result[0]['artist'] + " - " + result.result[0]['title'];
        h4.className = "resultText";
        $('#results').append(h4);
    });

    $("#songForm").css("display", "none");
    $(".entersong").css("display", "inline");

    event.preventDefault();
  
});