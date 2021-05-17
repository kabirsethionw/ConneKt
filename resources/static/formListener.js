$(document).ready(function(){
    $("#usrname").keypress(function(){
        //$('form').hide();
        //username format verification
    });


    $('#signupForm').submit(function(e){
        e.preventDefault();
        alert($('#name').val())
        var dat = {
            name: $('#name').val(),
            email: $('#email').val(),
            dob: $('#dob').val(),
            usrname: $('#usrname').val(),
            password: $('#password').val()
        }
        
        $.ajax({
           type: 'POST',
           url: 'http://localhost:8080/app/signup',
           data: dat,
           success: function(data){ 
                $('form').hide();
                $('#status').text("Success!");
                console.log(data)
           },
           error: function(textStatus, error){
                console.log(textStatus);
           } 
        });
        e.preventDefault();
        return false;
    });

    $('#loginForm').submit(function(e){
        e.preventDefault();
        alert("POST request")
        var dat = {
            usrname: $('#usrname').val(),
            password: $('#password').val()
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/app/login',
            data: dat,
            success: function(data){
                $('#loginForm').hide();
                $('#status').text("Success!");
                $('.proceed').css("visibility","visible");
                $('.proceed').click(function(){
                    delete data['password'];
                    delete data['dob'];
                    var urlEncodedDataPairs = [];
                    for(key in data){
                        urlEncodedDataPairs.push(encodeURIComponent(key)+'='+encodeURIComponent(data[key]));
                    }
                    var params = urlEncodedDataPairs.join("&");
                    alert(params);
                    window.location.href = 'http://localhost:8080/app/home'+'?'+params;
                })
                // alert(data);            
            }
        });
        e.preventDefault();
        return false;
    });

    $('#logout').click(function(){
        window.location.href = 'http://localhost:8080/app/logout'
    });

    $(document).ready(function() {
        var userId = window.location.search.substring(1).split('&')[0];
        var url = 'http://localhost:8080/app/getFriends/60940a664060b627dc49b307';
        $.ajax({
            type:'GET',
            url,
            success: function(usrData){
                usrData.forEach(function(usrData){
                    alert(usrData);
                    $('#side-nav').append('<div class="friend"><strong>'+usrData.usrname+'</strong>'+'<small> ('
                    +usrData.name+')</small></div>');
                });    
            },
            error:function(){
                $('#side-nav').append('<div style="color: red;"><strong>Error:</strong> Could not fetch data :/</div>');
            }
        });
    });
    
    $('#discover').click(function(){

        window.location.href = "http://localhost:8080/app/getPeople?"+window.location.search.substring(1);
    });

    $('.button3').click(function(){ //http://localhost:8080/app/getPeople?id=60940a664060b627dc49b307
        var friendId = $(this).attr("name");
        var userId = window.location.search.substring(1).split("&")[0].split('=')[1] //substring of home should be passed
        var url = 'http://localhost:8080/app/addFriend/'+userId+'.'+friendId;
        console.log("jquery: userId ",userId,", friendId ",friendId);
        $.ajax({
            type:'POST',
            url,
            context: this,
            success:function(data){
                alert($(this).css("display","none"));
                return 0;
            },
            error:function(err){
                alert("Error ",err.error);
            }
        });
        
    });

});