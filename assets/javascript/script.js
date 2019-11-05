$(document).ready(function() {

    $(document).foundation();



    let slideCount = 0;
    const currWeather = [];
    const newWeather = [];
    let currentCity;
    let bestIngredient = ""
    let disDrinks = []

    // used for setting the display of the weather icon and background
    let displayConditions = [{

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


    //config for slick slideshow
    $('#drink-slideshow').slick({
        "arrows": true,
        "autoplay": true,
        "autoplaySpeed": 5000,

    });


    //open weather map api key
    var APIKey = "5af2d38e7be7d61c1c6ad8b593ca7cdf";

    // removes the load screen when clicked
    $("#loading").on("click", function() {
            $("#loading").hide();

        })
        // gets a drink for the new location the user inputs
    $("#loc-search").on("click", function() {
        slideCount++;
        let cityLocation = $("#loc-value").val().trim();

        getWeatherFor(cityLocation);


    })



    // gets the users current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longintude = position.coords.longitude;
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + latitude + "&lon=" + longintude + "&appid=" + APIKey

            $.ajax({
                url: queryURL,
                method: "GET"
            })

            .then(function(response) {
                //hides the load screen
                $("#loading").hide();
                currentCity = response.name
                console.log(currentCity)
                currWeather[0] = isHot(response.main.temp_max);
                currWeather[1] = isCloudy(response.clouds.all);
                currWeather[2] = isRaining(response.weather[0].main);
                // runs the logic to select the ingredient we recommend
                bestIngredient = (getIngredient(currWeather))
                    // checks the  conditions and sets them to an array currWeather used the get ingredient function

                weathertoDisplay(response);

                //bring in drinks based on best ingredient
                callDrinks(bestIngredient, slideCount)
            });
        })
    } else {
        // throws an alert if geolocation isnt supported
        alert("Geolocation is not supported by this browser.");
    }


    //functions


    function drinkToDisplay(input) {


        $("#drink-name" + input).text(disDrinks[input].name);
        for (let j = 0; j < disDrinks[input].ingredients.length; j++) {
            let listItem = $("<li>").html(disDrinks[input].ingredients[j].amount + "<b> " + disDrinks[input].ingredients[j].name + "</b>");

            $("#ingredients" + input).append(listItem);
        }

        $("#recipe" + input).text(disDrinks[input].recipe);
        $("#img" + input).attr("src", disDrinks[input].img);

    }
    // function for random
    function randomize(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //deterimes if its cloudy
    function isCloudy(input) {
        if (input > 35) {
            return "cloudy"
        } else
            return "sunny"

    }
    // determines if its hot
    function isHot(input) {
        if (input > 70) {
            return "hot"
        } else {
            return "cold"
        }
    }

    //determines if its raining
    function isRaining(input) {
        if (input === "Rain" || input === "Thunderstorm") {
            return "rainy"
        } else {
            return "norain"
        }
    }

    //determines what to set the background to 
    function setDisplayCondition(input) {
        if (input[2] === "rainy") {
            return displayConditions[2]
        } else if (input[1] === "cloudy") {
            return displayConditions[3]
        } else {
            return displayConditions[0]
        }
    }
    // takes in the weather and suggests a ingredient
    function getIngredient(weather) {

        const ingredientsToWeather = {
            vodka: { hot: 6, cold: 7, rainy: 6, norain: 5, cloudy: 11, sunny: 6 },
            gin: { hot: 7, cold: 6, rainy: 9, norain: 4, cloudy: 10, sunny: 7 },
            whiskey: { hot: 4, cold: 9, rainy: 7, norain: 11, cloudy: 7, sunny: 5 },
            rum: { hot: 9, cold: 4, rainy: 5, norain: 12, cloudy: 8, sunny: 11 }
        };

        const ingredientScores = {};

        for (let ingr in ingredientsToWeather) {

            for (let weatherType of weather) {
                if (!ingredientScores[ingr]) {
                    ingredientScores[ingr] = 0;
                }
                ingredientScores[ingr] += ingredientsToWeather[ingr][weatherType];
            }
        }

        let winningIngr;
        let winningScore = 0;
        for (let ingr in ingredientScores) {

            if (ingredientScores[ingr] > winningScore) {
                winningScore = ingredientScores[ingr];
                winningIngr = ingr;
            }
        }
        return winningIngr;
    };
    // gets the weather for a certain city
    function getWeatherFor(input) {
        let newArray;
        const GoogleAPIKey = "AIzaSyC3qyHQsX5o7yXyc5zI-FYE1hrXlKVmqHo";
        const WeatherAPIKey = "3cc9b3772873588eb5472e5de97869f4";
        let latitude = ""
        let longitude = ""
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + " &key=" + GoogleAPIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            latitude = response.results[0].geometry.location.lat;
            longitude = response.results[0].geometry.location.lng;
            const WeatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + latitude + "&lon=" + longitude + "&appid=" + WeatherAPIKey;
            return $.ajax({
                    url: WeatherqueryURL,
                    method: "GET"
                })
                .then(function(response) {
                    currentCity = response.name;
                    newArray = [(isHot(response.main.temp_max)),
                        (isCloudy(response.clouds.all)),
                        (isRaining(response.weather[0].main))
                    ];
                    let nextSuggestion = getIngredient(newArray)
                    callDrinks(nextSuggestion, slideCount);

                    weathertoDisplay(response);

                })


        })


    }


    //gets a drink from the database takes in the recommended ingridient and the place it should be put in the database
    function callDrinks(ingridient, num) {
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingridient;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            //selects a random drink from the list of 10 responses 
            const drink = response.drinks;
            var n = drink.length;
            const random = Math.floor(Math.random() * n);
            specific = drink[random];
            var specificId = specific.idDrink;

            // looks up the details of the specific drink

            var queryURL2 = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + specificId;

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(response) {

                let index = 1;
                let ingredientArray = [];
                let drinkAgain = response.drinks[0]


                // used to grab all the ingredients and their measurements and formats the the way we want
                while (drinkAgain['strIngredient' + index]) {
                    ingredientArray.push({ name: drinkAgain['strIngredient' + index], amount: drinkAgain['strMeasure' + index] ? drinkAgain['strMeasure' + index] : "A dash " });
                    index++;
                }

                disDrinks.push({
                    "name": drinkAgain.strDrink,
                    "recipe": drinkAgain.strInstructions,
                    "img": drinkAgain.strDrinkThumb,
                    "ingredients": ingredientArray
                })

                // adds the suggested drink to the display

                $("#drink-slideshow").slick('slickAdd', '<div class="slide"><img id="img' + slideCount + '"><div class="slide-caption"><h3 id="drink-name' + slideCount + '" class="text-center"></h3><div class="grid-x"><div class="cell large-6"><ul id="ingredients' + slideCount + '"></ul></div><div class="cell large-6"><p id="recipe' + slideCount + '"></p></div><p class="city">Drink for: <b>' + currentCity + '</b></p></div></div></div>');
                drinkToDisplay(num);
                $("#drink-slideshow").slick('slickNext');

            });

        });
    }

    function weathertoDisplay(response) {


        //adds the weather to the DOM
        $("body").removeClass()
        $("body").addClass(setDisplayCondition(currWeather).background)
        $("#condition").addClass(setDisplayCondition(currWeather).conditionIcon)
        $("#location").text(response.name);
        $("#cloud").text(response.clouds.all);
        $("#wind-speed").text(response.wind.speed);

        $("#humidity").text(response.main.humidity);

        $("#temperature").text(Math.round(response.main.temp_max));
    }

});