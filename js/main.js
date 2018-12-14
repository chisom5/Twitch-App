/*

1. I will create an array for twitch streamer.
2. then loop through them and call the ajax function.
3. In the Ajax function call the api 
4. function that appends our result depending whelther they inline or not.

**/
$(document).ready(function() {
    var status, url, picture, x = 0;
    var Streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

    for (var i = 0; i < Streamers.length; i++) {
        // call the ajax function
        handleAjax();
    }

    function handleAjax() {
        $.ajax({
            url: "https://wind-bow.gomix.me/twitch-api/streams/" + Streamers[i] +
                "?callback=?",
            dataType: "jsonp",
            data: {
                format: "json"
            },

            success: function(data) {
                fetchData(data)
            },
            error: function() {
                console.log("error in accessing the json");
            }
        })
    }

    function fetchData(data) {
        console.log(data);

        if (data.stream === null) {
            url = data._links.channel.substr(38);
            updateOfflineUsers();
        } else if (data.status == 422 || data.status == 404) {
            status = data.message;
            showHTML(".unavailable");
        } else {
            if (data.stream.channel.logo !== null) {
                picture = 'url("' + data.stream.channel.logo + '")';
            } else {
                picture = 'url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")';
            }
            url = data._links.channel.substr(38);
            status = "<a href='https://twitch.tv/" + url + "' target='_blank'" + "'>" + data.stream.channel.display_name + "</a>" + " is currently streaming " + data.stream.game;
            showHTML(".online");
        }

    }

    function updateOfflineUsers() {
        $.ajax({
            url: "https://wind-bow.gomix.me/twitch-api/channels/" + url,
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function(response) {
                status = "Channel " + "'<a href='" + response.url + "' target='_blank'" + "'>" + response.display_name + "</a>'" + " is currently offline";
                if (response.logo !== null) {
                    picture = 'url("' + response.logo + '")';
                } else {
                    picture = 'url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")';
                }
                showHTML(".offline");
            }
        });
    }

    function showHTML(section) {
        $(section).append('<div class="section-result"><div class="row bg-color"><div class="one-third column"><div class="image-holder" id="user-image-' + x + '"></div></div><div class="two-thirds column"><span class="status-message">' + status + '</span></div></div></div>');

        if (section == ".online" || section == ".offline") {
            //If users are online or offline, load profile images
            $("#user-image-" + x).css({
                background: picture,
                'background-size': '55px'
            });
        }
        x++;
    }

    function showAll() {
        //Show all users
        $(".offline-users, .online-users").removeClass('focus');
        $(".all-users").addClass('focus');
        $(".online, .offline, .unavailable").removeClass('hidden');
    }

    function showOnline() {
        // show only online users
        $(".offline-users, .all-users").removeClass('focus');
        $(".online-users").addClass('focus');
        $(".offline, .unavailable").addClass('hidden');
        $(".online").removeClass('hidden');
    }

    function showOffline() {
        //show only offline users
        $(".online-users, .all-users").removeClass('focus');
        $(".offline-users").addClass('focus');
        $(".offline, .unavailable").removeClass('hidden');
        $(".online").addClass('hidden');
    }

    // Buttons function
    $(".all-users").click(function() {
        showAll();
    })
    $(".offline-users").click(function() {
        showOffline();
    })
    $(".online-users").click(function() {
        showOnline();
    })
})