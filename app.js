require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const lodash = require("lodash");
const https = require("https");
const alert = require("alert");
const mongoose = require("mongoose");
const { raw } = require("express");
const { parseInt } = require("lodash");
const jquery = require("jquery");
const { env } = require("process");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://" + process.env.DBUSERNAME + ":" + process.env.DBPASSWORD + "@cluster0.3ilza.mongodb.net/Users?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    f_name : String,
    l_name : String,
    email : String,
    phone : String,
    address_1 : String,
    address_2 : String,
    person_name : String,
    city : String,
    state : String,
    zip : Number,
    booking_date : Date
});

const User = mongoose.model("formList", userSchema);

function toCelcius(temp){
    return String(Math.round(temp - 273.16));
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

app.get("/form", function(req, res){
    res.render("form");
});

app.post("/form-send", function(req, res){
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const email = req.body.email;
    const phone = req.body.phone_number;
    const address_1 = req.body.address_1;
    const address_2 = req.body.address_2;
    const person_name = req.body.service;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip_code;
    const newUser = new User({
        f_name : f_name,
        l_name : l_name,
        email : email,
        phone : phone,
        address_1 : address_1,
        address_2 : address_2,
        person_name : person_name,
        city : city,
        state : state,
        zip : zip,
        booking_date : new Date()
    });

    newUser.save();
    alert("Your Booking has been Successfully done");
    res.redirect("/dealer");
});

app.get("/revenue-predictor", function(req, res){
    if(req.query.production){
        const prod = parseInt(req.query.production);
        const selling_price = parseInt(req.query.selling_price);
        const cost_price = parseInt(req.query.cost_price);
        const add_price = parseInt(req.query.additional_cost);
        const val = (prod * selling_price) - cost_price - add_price;
        res.render("revenue-predictor", {
            data: val
        });
    }
    else{
        res.render("revenue-predictor", {
            data: 0
        });
    }
});

app.get("/news", function(req, res){
    res.render("news");
});

app.post("/news", function(req, res){
    const search_query = req.body.newsSearch;
    const newsUrl = "https://news.google.com/search?q=";
    res.redirect(newsUrl + search_query);
});

app.get("/support", function(req, res){
    res.render("support");
});

app.post("/support", function(req, res){
    const search_query = req.body.videoSupport;
    const videoUrl = "https://www.youtube.com/results?search_query=";
    res.redirect(videoUrl + search_query);
});

app.get("/admin-login", function(req, res){
    res.render("admin-login");
});

app.post("/admin-login", function(req, res){
    const username = req.body.usernm;
    const password = req.body.passwd;
    if(username === process.env.DBUSERNAME && password === process.env.DBPASSWORD){
        User
        .find({}, function(err, result){
            if(err){
                console.log(err);
                res.redirect("/admin-login");
            }
            else{
                res.render("user-data", {
                    data: result
                });
            }
        })
        .limit(5)
        .sort({booking_date: -1});
    } 
    else{
        alert("Invalid Username or Password");
        res.redirect("/admin-login");
    }
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
        const apikey = process.env.API_KEY;
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+apikey;
        https.get(url, function(response){
            response.on("data", (d) =>{

                const weatherData =JSON.parse(d);
                if(weatherData.cod == "404"){
                    alert("Enter a Valid City Name");
                    res.render("weather_op", {
                        coordinate_lat : 0,
                        coordinate_lon : 0,
                        temp : 0,
                        img: 0,
                        temp_cel : 0,
                        pressure : 0,
                        humidity : 0,
                        cityname : 0,
                        cityid : 0,
                        countryName : 0,
                        feel_like: 0,
                        max_temp : 0,
                        min_temp : 0
                    });
                }
                else{
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
                    const max_temp_cel = toCelcius(max_temp);
                    const min_temp_cel = toCelcius(min_temp);
                    
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
                        max_temp : max_temp_cel,
                        min_temp : min_temp_cel
                    });
                }
            });
        });
    }
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});
