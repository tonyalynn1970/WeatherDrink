$(document).ready(function() {
    $(document).foundation();

    let pHLocations = ["Atlanta, GA", "Tampa, Florida", "New York, NY", "Denver, CO"];
    let pHConditions = [{
            "description": "sun",
            "conditionIcon": "wi-day-sunny",
            "background": "sunny"
        },

        {
            "description": "rain",
            "conditionIcon": "wi-day-thunderstorm",
            "background": "rainy"
        },

        {
            "description": "snow",
            "conditionIcon": "wi-day-snow-wind",
            "background": "snowy"
        },

        {
            "description": "cloud",
            "conditionIcon": "wi-day-cloudy",
            "background": "cloudy"
        }
    ]



    let condDisplay = pHConditions[randomize(0, pHConditions.length)];

    let tempDisplay = randomize(32, 100);
    let locDisplay = pHLocations[randomize(0, pHLocations.length)];
    $("#temperature").text(tempDisplay);
    $("#location").text(locDisplay);
    $("body").addClass(condDisplay.background)
    $("#condition").addClass(condDisplay.conditionIcon)
        //functions
        // function for random
    function randomize(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;

    }
    var APIKey = "3cc9b3772873588eb5472e5de97869f4";
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q="  + "&appid=" + APIKey

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longintude = position.coords.longitude;
            var queryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longintude + "&appid=" + APIKey

            $.ajax({
                url: queryURL,
                method: "GET"
            })

            .then(function(response) {
                console.log(queryURL);
                console.log(response);

                $(".city").append("City:" + response.name);
                $(".cloud").text("Cloud:" + response.clouds.all);
                $(".wind").text("Wind:" + response.wind.speed);
                $(".humidity").text("Humidity: " + response.main.humidity);
                $(".temp").text("Temperature (F)" + response.main.temp);

                console.log("Wind:" + response.main.wind);
                console.log("Humidity:" + response.main.humidity);
                console.log("Temperature (F):" + response.main.temp);
                console.log("Cloud:" + response.main.cloud);
                console.log("City:" + response.main.city);

            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})