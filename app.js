const msg = document.querySelector(".msg");
const message = document.querySelector(".message");
const inputForm = document.querySelector(".inputForm");
const geoButton = document.querySelector(".geoButton");
const weatherDetail = document.querySelector(".weatherDetail");
const weatherCard = document.querySelector(".weather-card");
const weatherUpdate = document.querySelector(".data-update");
const exit = document.querySelector(".exit")
inputForm.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && inputForm.value !== "") {
        searchCity(inputForm.value)
    }
})
const dataUpdate = (data) => {
    console.log(data);
    weatherUpdate.innerHTML = `
        <div class="weatherImage">
                    <img src=${data.current.condition.icon} alt="">
        </div>
         <div class="weather-data">
                    <p class="temp">${data.current.temp_c}°C</p>
                    <p class="weatherCondition">${data.current.condition.text}</p>
                    <p class="city">${data.location.name},${data.location.country}</p>
                    <div class="more">
                        <div class="feelLike"><p>feel like</p> <p>${data.current.feelslike_c} °C</p> </div>
                        <div class="humidity"> <p>Humidity</p> ${data.current.humidity} </div>
                    </div>
        </div>
    `
}
const showWeatherData = () => {
    weatherDetail.style.display = "block";
    weatherCard.style.display = "none";
}
//for using search box
const searchCity = async (city) => {
    try {
        let api = `http://api.weatherapi.com/v1/current.json?key=ba79f324c7f94c47b25102110232610&q=${city}&aqi=no`
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Enter a valid city`);
        }

        const responseJson = await response.json();
        dataUpdate(responseJson);
        msg.style.display = "block"
        msg.classList.add("pending");
        msg.innerText = "Your data is loading";

        setTimeout(showWeatherData, 2000);





    } catch (error) {
        msg.style.display = "block"
        msg.classList.add("danger");
        msg.innerText = "Enter a valid city"

    }
}
// for using geolocation


geoButton.addEventListener("click", () => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                weatherWithGeo(lat, long);
            } else {
                alert("You have denied access to your location");
            }
        })
    }

}

)
const weatherWithGeo = async (lat, long) => {
    try {
        let geoApi = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=5c543c14907d46b29ee0b54bb4fcabf0`
        const geoResponse = await fetch(geoApi);
        if (!geoResponse.ok) {
            throw new Error(geoResponse.status);
        }

        const geoResponseJson = await geoResponse.json();
        const country = geoResponseJson.features[0].properties.country;
        console.log(country);
        // pass the country to the api 
        let weatherApi = `http://api.weatherapi.com/v1/current.json?key=ba79f324c7f94c47b25102110232610&q=${country}&aqi=no`
        const weatherResponse = await fetch(weatherApi);
        if (!weatherResponse.ok) {
            throw new Error(weatherResponse.status)
        }
        const weatherResponseJson = await weatherResponse.json();
        console.log(weatherResponseJson);
        dataUpdate(weatherResponseJson);
        setTimeout(showWeatherData, 2000);
        msg.style.display = "block"
        msg.classList.add("pending");
        msg.innerText = "Your data is loading";
    } catch (error) {
        msg.style.display = "block"
        msg.classList.add("danger");
        msg.innerText = `${error}`
    }
}
// back to the main menu
exit.addEventListener("click", () => {
    weatherDetail.style.display = "none";
    weatherCard.style.display = ""
    msg.style.display = "none"
    /*  msg.classList.remove("pending");
     msg.classList.remove("danger"); */


})
