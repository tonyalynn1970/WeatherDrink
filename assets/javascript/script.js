$(document).ready(function() {
    $(document).foundation();

    let pHLocations = ["Atlanta, GA", "Tampa, Florida", "New York, NY", "Denver, CO"];
    let pHConditions = ["wi-day-sunny", "wi-day-cloudy", "wi-day-snow-wind", "wi-day-thunderstorm"]

    let condDisplay = pHConditions[randomize(0, pHConditions.length)];
    console.log(condDisplay)
    let tempDisplay = randomize(32, 100);
    let locDisplay = pHLocations[randomize(0, pHLocations.length)];
    $("#temperature").text(tempDisplay);
    $("#location").text(locDisplay);

    $("#condition").addClass(condDisplay)
        //functions
        // function for random
    function randomize(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;

    }
})