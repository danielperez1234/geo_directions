// set map options
console.log("jkdn")
//prueba para agarrar el origen, no sirvio jaja
//import { calcRoute } from "./directions";
//console.log(origin);
var prueba2hola = localStorage.getItem("prueba2");  
var origin = prueba2hola;  
console.log(origin)
var destination =  "Guanajuato, Gto., México"
var mylatlng = { lat: 21.15153969516301, lng: -101.71164537558829 };
var mapOptions = {
    center: mylatlng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

let map;

function initMap() {
    //create Map
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
}
initMap();

//create a Directions service object to use the route method and get a result for our request
var diretionsService = new google.maps.DirectionsService();
//create a DirectionsRenderer object which we will use to display route
var directionsDisplay = new google.maps.DirectionsRenderer();
//bind the diretionsRenderer to the Map
directionsDisplay.setMap(map);
calcRouteOtro()
function calcRouteOtro() {
    var request = {
        //origin: document.getElementById("from").value,
        origin,
        //destination: document.getElementById("to").value,
        destination: "Guanajuato, Gto., México",
        travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
   }
    //Pass the request to the route method
    diretionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            //get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " +
                origin +
                ". <br />To: " +
                destination +
                ". <br />Driving distance <i class='fas fa-road'></i> :" +
                result.routes[0].legs[0].distance.text +
                ". <br />Duration <i class='fas fa-hourglass-start'></i> :" +
                result.routes[0].legs[0].duration.text +
                ".</div>";
            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete the routes from map
            directionsDisplay.setDirections({ routes: [] });
            map.setCenter(mylatlng);
            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle-start'></i>Could not retrieve driving distance. </div>";
        }
    });
}


//REVERSE GEOCODING 

const geocoder = new google.maps.Geocoder();
const infowindow = new google.maps.InfoWindow();

//const inputI = "21.0251466,-101.2785227";
//geocodeLatLng(geocoder, map, infowindow, inputI);


function geocodeLatLng(geocoder, map, infowindow, input, contador) {
    var nombreCoordenada = ""
    //var input = inputI
    const latlngStr = input.split(",", 2);
    const latlng = {
      lat: parseFloat(latlngStr[0]),
      lng: parseFloat(latlngStr[1]),
    };
  
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          map.setZoom(11);
          //console.log(response.results[0].address_components[3].long_name)
          nombreCoordenada = response.results[0].address_components[1].long_name + ", " + response.results[0].address_components[2].short_name + ", "  + response.results[0].address_components[3].long_name
          console.log(nombreCoordenada)
          nombresSucursales[contador] = nombreCoordenada
          console.log(nombresSucursales)

          //const marker = new google.maps.Marker({
            //position: latlng,
            //map: map,
          //});
  
          infowindow.setContent(response.results[0].formatted_address);
          //infowindow.open(map, marker);
        } else {
          console.log("not found")
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }
  


//ARREGLOS
var coordenadasSucursales = []
var contador = 0
var nombresSucursales = []

const API_URL = "http://172.18.70.174:4000/api/sucursales/findAll"; //cambiar IP
const xhr = new XMLHttpRequest();
async function onRequestHandler(){
    if(this.readyState == 4 && this.status == 200){
      console.log(this.response);
      const data = JSON.parse(this.response);
      var list = document.createElement("ul");
      //ponemos el mapa
      var myLatlngI = new google.maps.LatLng(21.0251466,-101.2785227);
        var mapOptions = {
            zoom: 8,
            center: myLatlngI
        }
        //var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
        
        //var marker;
      data.map(item => { 
            //var myLatlngCoordenadaSucursal = new google.maps.LatLng(item.latitude,item.longitude);
            var coordenadaSucursal = item.latitude + ", " +item.longitude
            //console.log(coordenadaSucursal)
            coordenadasSucursales[contador] = coordenadaSucursal
            console.log(coordenadasSucursales)
            //var nombreSucursal = ""
            geocodeLatLng(geocoder, map, infowindow, coordenadaSucursal, contador);
            
            contador = contador + 1
            //console.log("ajd" +nombreSucursal)
            //nombresSucursales[contador] = nombreSucursal
            //console.log(nombresSucursales)
            //marker = new google.maps.Marker({
            //    position: myLatlngCoordenadaSucursal,
            //    map: map
            //});
            //marker.setMap(map);

        });
        //var listDiv = document.getElementById('objects');
        //listDiv.appendChild(list); 
    }
  }
xhr.addEventListener("load", onRequestHandler);
xhr.open("GET",API_URL);
xhr.send();




window.calcRouteOtro = calcRouteOtro;
//create autocomplete objects for all inputs
var options = {
    types: ["(cities)"],
    fields: ["address_components", "geometry", "icon", "name"],
};