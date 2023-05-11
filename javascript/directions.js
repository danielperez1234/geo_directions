// set map options
var mylatlng = { lat: 21.15153969516301, lng: -101.71164537558829 };
var mapOptions = {
    center: mylatlng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
// let map;
// function initMap() {
//     //create Map
//     map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
// }
// initMap();

// //create a Directions service object to use the route method and get a result for our request
// var diretionsService = new google.maps.DirectionsService();
// //create a DirectionsRenderer object which we will use to display route
// var directionsDisplay = new google.maps.DirectionsRenderer();
// //bind the diretionsRenderer to the Map
// directionsDisplay.setMap(map);
function calcRoute() {
    var request = document.getElementById("from").value
        //destination: document.getElementById("to").value,
        //         travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
        //         unitSystem: google.maps.UnitSystem.METRIC
    
    var origin2 = "funciona por favor"
    localStorage.setItem("prueba2", request);  
    console.log("lkas")
    window.location.href = "/directions";
    //return origin
}

//intento para lo de los marcadores
const API_URL = "http://192.168.0.5:4000/api/sucursales/findAll"; //cambiar IP
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
        var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
        
        var marker;
        //INTENTAR HACER UN ARREGLO Y LUEGO UN FOR
        //https://developers.google.com/maps/documentation/javascript/examples/icon-complex#maps_icon_complex-javascript
      data.map(item => { 
            //var li = document.createElement("li"); 
            //var link = document.createElement("a"); 
            //link.href = "/index?coordinates="+item.latitude+","+item.longitude;
            //link.innerHTML = item.name;
            //li.appendChild(link)
            //list.appendChild(li); 
            var myLatlngCoordenadaSucursal = new google.maps.LatLng(item.latitude,item.longitude);
              
            marker = new google.maps.Marker({
                position: myLatlngCoordenadaSucursal,
                map: map
            });
            marker.setMap(map);

        });
        var listDiv = document.getElementById('objects');
        listDiv.appendChild(list); 
    }
  }
xhr.addEventListener("load", onRequestHandler);
xhr.open("GET",API_URL);
xhr.send();


//prueba marcador
//var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
//var mapOptions = {
  //zoom: 4,
  //center: myLatlng
//}
//var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

//var marker = new google.maps.Marker({
//    position: myLatlng,
//    title:"Hello World!"
//});

// To add the marker to the map, call setMap();
//marker.setMap(map);




//export { calcRoute };
// function calcRoute() {
//     var request = {
//         origin: document.getElementById("from").value,
//         destination: document.getElementById("to").value,
//         travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
//         unitSystem: google.maps.UnitSystem.METRIC
//     }
//     //Pass the request to the route method
//     diretionsService.route(request, (result, status) => {
//         if (status == google.maps.DirectionsStatus.OK) {
//             //get distance and time
//             const output = document.querySelector('#output');
//             output.innerHTML = "<div class='alert-info'>From: " +
//                 document.getElementById("from").value +
//                 ". <br />To: " +
//                 document.getElementById("to").value +
//                 ". <br />Driving distance <i class='fas fa-road'></i> :" +
//                 result.routes[0].legs[0].distance.text +
//                 ". <br />Duration <i class='fas fa-hourglass-start'></i> :" +
//                 result.routes[0].legs[0].duration.text +
//                 ".</div>";
//             //display route
//             directionsDisplay.setDirections(result);
//         } else {
//             //delete the routes from map
//             directionsDisplay.setDirections({ routes: [] });
//             map.setCenter(mylatlng);
//             //show error message
//             output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle-start'></i>Could not retrieve driving distance. </div>";
//         }
//     });
// }

window.calcRoute = calcRoute;
//create autocomplete objects for all inputs
var options = {
    types: ["(cities)"],
    fields: ["address_components", "geometry", "icon", "name"],
};
var input_from = document.getElementById("from");
var autocomplete_from = new google.maps.places.Autocomplete(input_from, options);
//var input_to = document.getElementById("to");
//var autocomplete_from = new google.maps.places.Autocomplete(input_to, options);