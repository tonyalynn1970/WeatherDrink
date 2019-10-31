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
})