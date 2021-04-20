const express = require("express");
const ejs = require("ejs");
const lodash = require("lodash");
const { round } = require("lodash");
const https = require("https");
const { type } = require("os");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

function toCelcius(temp){
    return String(round(temp - 273.16, 2))
}

app.get("/", function(req, res){
    res.render("index");
});

app.get("/soil-check", function(req, res){
    res.render("soil-check");
});

app.get("/water-check", function(req, res){
    res.render("water-check");
});

app.get("/food-check", function(req, res){
    res.render("food-check");
});

app.get("/seed-check", function(req, res){
    res.render("seed-check");
});

app.get("/market-price", function(req, res){
    res.render("market-price");
});

app.get("/dealer", function(req, res){
    res.render("dealer");
});

app.get("/news", function(req, res){
    res.render("news");
});

app.get("/weather", function(req, res){
    res.render("weather");
});

app.post("/weather", function(req, res){
    const query = req.body.city;
    if(query == "" || query == null){
        res.redirect("weather");
    }
    else{
        const apikey = "1698a076f54bd4a9cd70ad24c66c512c";
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+apikey;
        https.get(url, function(response){
            response.on("data", (d) =>{

                const weatherData =JSON.parse(d);
                const temp = weatherData.main.temp;
                const icon = weatherData.weather[0].icon;
                const imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                const lat = weatherData.coord.lat;
                const lon = weatherData.coord.lon;
                const temp_cel = toCelcius(temp);
                const pressure = weatherData.main.pressure;
                const humidity = weatherData.main.humidity;
                const cityname = weatherData.name;
                const cityid = weatherData.id;
                const countryName = weatherData.sys.country;
                const feels = weatherData.main.feels_like;
                const max_temp = weatherData.main.temp_max;
                const min_temp = weatherData.main.temp_min;
                
                res.render("weather_op", {
                    coordinate_lat : lat,
                    coordinate_lon : lon,
                    temp : temp,
                    img: imgURL,
                    temp_cel : temp_cel,
                    pressure : pressure,
                    humidity : humidity,
                    cityname : cityname,
                    cityid : cityid,
                    countryName : countryName,
                    feel_like: feels,
                    max_temp : max_temp,
                    min_temp : min_temp
                });
            });
        });
    }
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});
