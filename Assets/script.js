//setting up the main variables
var cityHistory = [];
var city;
var weatherCard = $(".card-body");


//function to get the data from the API for the typed city
function getData() { 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a243e5c921d5eeb231733dee2c0b0346" 
    weatherCard.empty();
    $("#forecast").empty();
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //function to create the weather card at fill it with the data from the API
        console.log(response);
        var City = city.toUpperCase();
        var date = moment().format(" MM/DD/YYYY");
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var name = $("<h3>").html(City + date);
        weatherCard.prepend(name);
        weatherCard.append($("<img>").attr("src", iconURL));
        var description = response.weather[0].description;
        weatherCard.append($("<p>").html("Description: " + description));
        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        weatherCard.append($("<p>").html("Temperature: " + temp + " &#8457")); 
        var humidity = response.main.humidity;
        weatherCard.append($("<p>").html("Humidity: " + humidity + "&#37")); 
        var windSpeed = response.wind.speed + " MPH" + " at " + response.wind.deg + "&#176";
        weatherCard.append($("<p>").html("Wind Speed: " + windSpeed));
        var lat = response.coord.lat;
        var lon = response.coord.lon;
    
    
        //forecast api call to add the 5 day forecast with typed city
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=a243e5c921d5eeb231733dee2c0b0346", 
        
        }).then(function (response) {
            console.log(response);
            for (i = 0; i < 32; i+=8) { 
                console.log(response.list[i]);
                //creating the 5 day forecast cards and adding the data from the API
                var forecastCard = $("<div>").attr("class", "col bg-success text-white p-3 m-1 rounded");
                $('#forecast').append(forecastCard);
                var myDate = new Date(response.list[i].dt * 1000);
                forecastCard.append($('<h4>').html(myDate.toLocaleDateString()));
                var iconCode = response.list[i].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + '.png';
                forecastCard.append($('<img>').attr('src', iconURL));
                var description = response.list[i].weather[0].description;
                forecastCard.append($('<p>').html('Description: ' + description));
                var temp = Math.round((response.list[i].main.temp - 273.15) * 1.80 + 32);
                forecastCard.append($('<p>').html('Temp: ' + temp + '&#8457'));  
                var humidity = response.list[i].main.humidity;               
                forecastCard.append($('<p>').html('Humidity: ' + humidity + '&#37'));
                var windSpeed = response.list[i].wind.speed + " MPH" + " at " + response.list[i].wind.deg + "&#176";
                forecastCard.append($('<p>').html('Wind Speed: ' + windSpeed));
            }
        })
    })
};
//defining city and calling the getData function on click of the search button while pushing the city to the cityHistory array
$('#searchCity').click(function() {
    city = $('#city').val().trim();
    var City = city.toUpperCase();
    getData();
    var checkArray = cityHistory.includes(City);
    if (checkArray == true) {
        return
    }
    
    else {
        var City = city.toUpperCase();
        cityHistory.push(City);
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
        var cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-success",
            href: "#"
        });
        cityListButton.text(City);
        $('.list-group').append(cityListButton);
    };
});
//local storage function to get the cityHistory array from local storage and display it on the page
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("cityHistory"));
    if (storedCities !== null) {
        cityHistory = storedCities;
    };
     
    for (i = 0; i < cityHistory.length; i++) {
        if (i == 8) {
            break;
          }
        
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-success",
            href: "#"
        });
        
        cityListButton.text(cityHistory[i]);
        $('.list-group').append(cityListButton);
    }
};
//calling the getItems function to display the cityHistory array on the page
getItems();
//allowing the user to click on the cityHistory buttons to get the weather data for that city
$('.list-group-item').click(function() {
    city = $(this).text();
    getData();
});
//clearing the cityHistory array and reloading the page
$('#clearCity').click( function() {
    window.localStorage.clear();
    location.reload();
    return false;
});

