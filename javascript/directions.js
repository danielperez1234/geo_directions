// set map options
//*mylatlng contiene las coordenadas de latitud y longitud.
var mylatlng = { lat: 21.15153969516301, lng: -101.71164537558829 };
//*Este objeto contiene las coordenadas de latitud y longitud para el mapa
var mapOptions = {
    center: mylatlng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

/*Esta funcion obtiene los valores de los elementos de formulario con
los ID "form" y "name", y los guarda en las variables "request" y "name",
respectivamente.
Utiliza "localStorage.setItem()"" para almacenar los valores en el 
almacenamiento local del navegador*/
function calcRoute() {
    var request = document.getElementById("from").value
    var name = document.getElementById("name").value

    localStorage.setItem("prueba2", request);
    localStorage.setItem("username", name);

    window.location.href = "/directions";

}

//intento para lo de los marcadores
/*Se guarda el endpoint de la API en "API_URL" para obtener
datos de sucursales*/
const API_URL = "http://172.18.70.100:4000/api/sucursales/findAll"; //cambiar IP
/*Se crea la instancia para realizar una solicitud GET a la API
y obtener los datos de sucursales*/
const xhr = new XMLHttpRequest();
/*Muestra los datos de las sucursales con base a la respuesta JSON
y se crea una lista en el HTML*/
async function onRequestHandler() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response);
        const data = JSON.parse(this.response);
        var list = document.createElement("ul");
        //ponemos el mapa
        var myLatlngI = new google.maps.LatLng(21.0251466, -101.2785227);
        var mapOptions = {
            zoom: 7.5,
            center: myLatlngI
        }
        var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

        var marker;

        data.map(item => {
            var myLatlngCoordenadaSucursal = new google.maps.LatLng(item.latitude, item.longitude);
            marker = new google.maps.Marker({
                position: myLatlngCoordenadaSucursal,
                icon: '/map',
                map: map
            });
            marker.setMap(map);

        });
        var listDiv = document.getElementById('objects');
        listDiv.appendChild(list);
    }
}
/*Esta línea agrega un evento de escucha para el evento "load" (carga) 
al objeto xhr. Cuando se completa la solicitud, es decir, cuando la 
respuesta es recibida correctamente, se ejecutará la función 
"onRequestHandler".*/
xhr.addEventListener("load", onRequestHandler);
/*Esta línea configura la solicitud XHR utilizando el método open. 
Se especifica "GET" como el tipo de solicitud y API_URL como la URL a 
la que se enviará la solicitud.*/
xhr.open("GET", API_URL);
xhr.send();

window.calcRoute = calcRoute;
//create autocomplete objects for all inputs
/*Se crea un objeto options que especifica las 
opciones de autocompletado para los campos de entrada.
Las opciones también incluyen los campos de 
información que se solicitarán a la API de Places, 
como los componentes de dirección, geometría, icono 
y nombre.*/
var options = {
    types: ["(cities)"],
    fields: ["address_components", "geometry", "icon", "name"],
};
var input_from = document.getElementById("from");
var autocomplete_from = new google.maps.places.Autocomplete(input_from, options);
