/*Con esta variable se permite calcular la distancia 
y los tiempos de viaje entre mutiples ubicaciones*/
const disMatrix = new google.maps.DistanceMatrixService();      

var origin = localStorage.getItem("prueba2");
var username = localStorage.getItem("username");
//var origin = prueba2hola;
console.log(origin);
console.log(username);
//var destination = "Guanajuato, Gto., México";
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
/*se utiliza para calcular la ruta desde el origen hasta el destino 
especificado. Utiliza el objeto diretionsService para enviar una 
solicitud de ruta y, si la respuesta es exitosa, muestra la ruta en 
el mapa utilizando el objeto directionsDisplay.*/
function calcRouteOtro(destination) {
  var request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  //Pass the request to the route method
  diretionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
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

//LISTA TAL VEZ QUITAMOS
var diretionsServiceLista = new google.maps.DirectionsService();
function imprimirLista(destination, distanciaTxt, duracionTxt) {
  console.log("EL DESTINO ANTES" + destination)

  var div = document.createElement("div");
  const output = document.querySelector("#output").appendChild(div);
  
console.log("EL DESTINO DENTRO" + destination)
  output.innerHTML =
    "<div class='alert-info'>From: " +
    origin +
    ". <br />To: " +
    destination +
    ". <br />Driving distance <i class='fas fa-road'></i> :" +
    //result.routes[0].legs[0].distance.text +
    distanciaTxt +
    ". <br />Duration <i class='fas fa-hourglass-start'></i> :" +
    //result.routes[0].legs[0].duration.text +
    duracionTxt +
    ". <br><br></div>";
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

const API_URL = "http://172.18.70.100:4000/api/sucursales/findAll"; //cambiar IP
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
    await Promise.all(data.map(async (item) => {
      var coordenadaSucursal = item.latitude + ", " + item.longitude;
      coordenadasSucursales[contador] = coordenadaSucursal;
      console.log(coordenadasSucursales);
      contador = contador + 1;
     await  geocodeLatLng(geocoder, map, infowindow, coordenadaSucursal, contador);
      
  }));
    distanceMatrix()
  }
}

//DISTANCE MATRIX
async function distanceMatrix() {

    var nombresDistancias = [[]]
  const matrixOptions = {
    origins: [origin], // technician locations
    destinations: nombresSucursales, // customer address
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC
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
    console.log(response.rows[0].elements)
    var routeseconds = response.rows[0].elements[i].duration.value;
    
    if (routeseconds > 0 && routeseconds < leastseconds) {
      leastseconds = routeseconds; // this route is the shortest (so far)
      drivetime = response.rows[0].elements[i].duration.text; // hours and minutes
      closest = response.destinationAddresses[i]; // city name from destinations
    }
    
    //otro intento
    var nombreDestino = response.destinationAddresses[i]
    var duracionDestino = response.rows[0].elements[i].duration.value
    var distanciaTxtx = response.rows[0].elements[i].distance.text
    var duracionTxt = response.rows[0].elements[i].duration.text
    console.log(i)
    nombresDistancias[i] = new Array(4);
    //nombresDistancias[i][0] = {nombre: nombreDestino};
    //nombresDistancias[i][1] = {distancia: duracionDestino};
    
    nombresDistancias[i][0] = nombreDestino;
    nombresDistancias[i][1] = duracionDestino;
    nombresDistancias[i][2] = distanciaTxtx;
    nombresDistancias[i][3] = duracionTxt;

    nombresDistancias.sort((a,b) => a[1] - b[1])

    console.log("ordenado")
    console.log(nombresDistancias);
  }

  calcRouteOtro(closest)
  alert(username + " tu sucursal mas cercana es " + closest + ", se encuentra a " + drivetime + " manejando"); 


  for (let i=0; i<routes.length; i++) {
    console.log("ordenado dentro")
    console.log(nombresDistancias);
    console.log("parametro: " + nombresDistancias[i][0])
    imprimirLista(nombresDistancias[i][0],nombresDistancias[i][2], nombresDistancias[i][3])
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

