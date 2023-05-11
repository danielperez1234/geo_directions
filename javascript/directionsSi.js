const disMatrix = new google.maps.DistanceMatrixService();      

var prueba2hola = localStorage.getItem("prueba2");
var origin = prueba2hola;
console.log(origin);
var destination = "Guanajuato, Gto., México";
var mylatlng = { lat: 21.15153969516301, lng: -101.71164537558829 };
var mapOptions = {
  center: mylatlng,
  zoom: 7,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
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
//calcRouteOtro();
function calcRouteOtro(destination) {
  var request = {
    //origin: document.getElementById("from").value,
    origin,
    destination,
    //destination: document.getElementById("to").value,
    //destination: "Guanajuato, Gto., México",
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  //Pass the request to the route method
  diretionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      //get distance and time
      // const output = document.querySelector("#output");
      // output.innerHTML =
      //   "<div class='alert-info'>From: " +
      //   origin +
      //   ". <br />To: " +
      //   destination +
      //   ". <br />Driving distance <i class='fas fa-road'></i> :" +
      //   result.routes[0].legs[0].distance.text +
      //   ". <br />Duration <i class='fas fa-hourglass-start'></i> :" +
      //   result.routes[0].legs[0].duration.text +
      //   ".</div>";
      //display route
      directionsDisplay.setDirections(result);
    } else {
      //delete the routes from map
      directionsDisplay.setDirections({ routes: [] });
      map.setCenter(mylatlng);
      //show error message
      output.innerHTML =
        "<div class='alert-danger'><i class='fas fa-exclamation-triangle-start'></i>Could not retrieve driving distance. </div>";
    }
  });
}

function imprimirLista(destination) {
  var request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  //Pass the request to the route method
  diretionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {

      var div = document.createElement("div");
      const output = document.querySelector("#output").appendChild(div);
      output.innerHTML =
        "<div class='alert-info'>From: " +
        origin +
        ". <br />To: " +
        destination +
        ". <br />Driving distance <i class='fas fa-road'></i> :" +
        result.routes[0].legs[0].distance.text +
        ". <br />Duration <i class='fas fa-hourglass-start'></i> :" +
        result.routes[0].legs[0].duration.text +
        ".</div>";
      
    } else {
      //delete the routes from map
      directionsDisplay.setDirections({ routes: [] });
      map.setCenter(mylatlng);
      //show error message
      output.innerHTML =
        "<div class='alert-danger'><i class='fas fa-exclamation-triangle-start'></i>Could not retrieve driving distance. </div>";
    }
  });
}

//REVERSE GEOCODING

const geocoder = new google.maps.Geocoder();
const infowindow = new google.maps.InfoWindow();

//const inputI = "21.0251466,-101.2785227";
//geocodeLatLng(geocoder, map, infowindow, inputI);

async function geocodeLatLng(geocoder, map, infowindow, input, contador) {
  var nombreCoordenada = "";
  //var input = inputI
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };
  try {
    var response = await geocoder.geocode({ location: latlng });
    console.log("se logro")
    if (response.results[0]) {
      map.setZoom(11);
      //console.log(response.results[0].address_components[3].long_name)
      nombreCoordenada =
        response.results[0].address_components[1].long_name +
        ", " +
        response.results[0].address_components[2].short_name +
        ", " +
        response.results[0].address_components[3].long_name;
      console.log(nombreCoordenada);
      nombresSucursales[contador] = nombreCoordenada;
      console.log(nombresSucursales);
      console.log("hola")
      //const marker = new google.maps.Marker({
      //position: latlng,
      //map: map,
      //});

      infowindow.setContent(response.results[0].formatted_address);
      //infowindow.open(map, marker);
    } else {
      console.log("not found");
      window.alert("No results found");
    }
  } catch (e) {
    window.alert("Geocoder failed due to: " + e);
  }
}

//ARREGLOS
var coordenadasSucursales = [];
var contador = 0;
var nombresSucursales = [];

const API_URL = "http://192.168.100.18:4000/api/sucursales/findAll"; //cambiar IP
const xhr = new XMLHttpRequest();
async function onRequestHandler() {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this.response);
    const data = JSON.parse(this.response);
    var list = document.createElement("ul");
    //ponemos el mapa
    var myLatlngI = new google.maps.LatLng(21.0251466, -101.2785227);
    var mapOptions = {
      zoom: 8,
      center: myLatlngI,
    };
    contador = -1
    //var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    await Promise.all(data.map(async (item) => {
      var coordenadaSucursal = item.latitude + ", " + item.longitude;
      //console.log(coordenadaSucursal)
      coordenadasSucursales[contador] = coordenadaSucursal;
      console.log(coordenadasSucursales);
      //var nombreSucursal = ""
      contador = contador + 1;
     await  geocodeLatLng(geocoder, map, infowindow, coordenadaSucursal, contador);
      
      //console.log("ajd" +nombreSucursal)
      //nombresSucursales[contador] = nombreSucursal
      //console.log(nombresSucursales)
      //marker = new google.maps.Marker({
      //    position: myLatlngCoordenadaSucursal,
      //    map: map
      //});
      //marker.setMap(map);
  }));
    //var marker;
    distanceMatrix()
    //var listDiv = document.getElementById('objects');
    //listDiv.appendChild(list);
  }
}

//DISTANCE MATRIX
async function distanceMatrix() {

    var nombresDistancias = [[]]
  const matrixOptions = {
    origins: [origin], // technician locations
    destinations: nombresSucursales, // customer address
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  // Call Distance Matrix service
  // Callback function used to process Distance Matrix response
  function callbackDisMatrix(response, status) {
    if (status !== "OK") {
      console.log(nombresSucursales)
      alert("Error with distance matrix");
      return;
    }
    console.log("hi")
    console.log(response);        
  }
  console.log(matrixOptions)
  var response = await disMatrix.getDistanceMatrix(matrixOptions, callbackDisMatrix);
  let routes = response.rows[0].elements;
  var leastseconds = 86400; // 24 hours
  let drivetime = "";
  let closest = "";

  for (let i=0; i<routes.length; i++) {
    console.log(response.rows[0].elements[0].duration.value)
    var routeseconds = response.rows[0].elements[i].duration.value;
    
    if (routeseconds > 0 && routeseconds < leastseconds) {
      leastseconds = routeseconds; // this route is the shortest (so far)
      drivetime = response.rows[0].elements[i].duration.text; // hours and minutes
      closest = response.destinationAddresses[i]; // city name from destinations
    }
    
    //otro intento
    var nombreDestino = response.destinationAddresses[i]
    var distanciaDestino = response.rows[0].elements[i].duration.value
    console.log(i)
    nombresDistancias[i] = new Array(2);
    //nombresDistancias[i][0] = {nombre: nombreDestino};
    //nombresDistancias[i][1] = {distancia: distanciaDestino};
    
    nombresDistancias[i][0] = nombreDestino;
    nombresDistancias[i][1] = distanciaDestino;

    //nombresDistancias.sort((a,b) => a[1] - b[1]);
    nombresDistancias.sort((a,b) => a[1] - b[1])

    console.log("ordenado")
    console.log(nombresDistancias);
  }

  calcRouteOtro(closest)
  alert("The closest location is " + closest + " (" + drivetime + ")"); 


  for (let i=0; i<routes.length; i++) {
    console.log("ordenado dentro")
    console.log(nombresDistancias);
    imprimirLista(nombresDistancias[i][0])
  }


}

function condicionParaOrdenar(personaA, personaB) {
    return personaB.edad - personaA.edad;
  }

xhr.addEventListener("load", onRequestHandler);
xhr.open("GET", API_URL);
xhr.send();

window.calcRouteOtro = calcRouteOtro;
//create autocomplete objects for all inputs
var options = {
  types: ["(cities)"],
  fields: ["address_components", "geometry", "icon", "name"],
};

