// console.log("Helool ji");

// const API_KEY  = ""

// async function showWeather(){
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;
//     let city = "goa";


//     const response = await  fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}');

//     const data = (await response).json();

//     console.log("Weather data:->" + data);
// }


const userTab = document.querySelector("[data-useWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grandAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInforContainer = document.querySelector(".user-info-container");


// initially  variables need 

let oldTab = userTab;
// const API_KEY  = "6cc3a2330a82548de2c1edadced43673";
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

oldTab.classList.add("current-tab");
getfromSessionStorage();

// ek kaam or panding hai  ??

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisiable if yes then make it visiable 
            userInforContainer.classList.remove("active");
            grandAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle searchwale tab pr thea ab your weather tab visiable karna h 
            searchForm.classList.remove("active");
            userInforContainer.classList.remove("active");
            // ab m your weather tab  me aagya hu , toh wather bhi display karna padega so let's check local storages first for coordinates, if we have saved  then there
            getfromSessionStorage();
        }
    }
}
 
userTab.addEventListener("click", ()=>{
    // pass clicked tab as input parameter 
    switchTab(userTab)
});
searchTab.addEventListener("click", ()=>{
    // pass clicked tab as input parameter 
    switchTab(searchTab)
});


// check if conrdinates  are already presestn in session storage 
function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nhi mile 
        grandAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(conrdinates){

    const {lat, lon} = conrdinates;

    // make grandcontainer invisible
    grandAccessContainer.classList.remove("active");
    // make loader visible 

    loadingScreen.classList.add("active");


    // API CALL 

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            // `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
        const data=  await response.json();

        loadingScreen.classList.remove("active");

        userInforContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err){
        loadingScreen.classList.remove("active");

        // HW 

    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the Elements . 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const  temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

console.log(weatherInfo);
    // fetch values form  weatherinfo object and put in UI element 

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 

    desc.innerText = weatherInfo.weather?.[0]?.description;

   

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

                                                                

}

function  getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPostion);
    }else{
        // hw show alert no geolocation support aviable uijm 
        console.log("This is server time out' Please try again")

    }
}

function showPostion(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon:position.coords.longitude,
        }

        sessionStorage.setItem("use-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
}

const grandAccessButton = document.querySelector("[data-grantAccess]")

grandAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;


    if(cityName === "")
        return;
    
    else
    fetchSearchWeatherInfo(cityName);
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active")
    userInforContainer.classList.remove("active")
    grandAccessButton.classList.remove("active");

    try{
        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInforContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // hw 
        console.log(err);
    }

}


// main project i create this project 