
mapboxgl.accessToken = config.MAPBOX_API_KEY;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    doubleClickZoom: false,
    center: [77.216721, 28.644800],
    zoom: 9
});

var marker = new mapboxgl.Marker()
    .setLngLat([77.216721, 28.644800])
    .addTo(map)

var pos

// Add geolocate
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000
    },
    fitBoundsOptions: {
        maxZoom: 18
    },
    trackUserLocation: true
}).on('geolocate', (position) => {
    pos = mapboxgl.LngLat.convert([position.coords.longitude, position.coords.latitude]);
    marker.setLngLat(pos);
    marker.addTo(map);
    fetchWeather(pos);
}), position = 'bottom-right');

// add geocode control
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false
}).on('result', (e) => {
    pos = mapboxgl.LngLat.convert(e.result.center);
    marker.setLngLat(pos);
    fetchWeather(pos);
}), position = 'top-left');

// add navigation control
map.addControl(new mapboxgl.NavigationControl(), position = 'bottom-right');

map.on('click', (e) => {
    pos = e.lngLat
    marker.setLngLat(pos);
    fetchWeather(pos)
});

function fetchWeather(coords) {
    lat = coords.lat;
    lng = coords.lng;
    
    // select target HTML element
    var report = document.getElementById('report');
    var loading = document.getElementById('loading');
    loading.style.display = 'block';
    report.style.display = 'none'

    fetch(`http://127.0.0.1:3000/weather?lat=${lat}&lng=${lng}`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            var dayTime = moment.unix(data.time).local().format('dddd, h:mm a');
            // report.textContent = JSON.stringify(data.report);
            report.style.display = 'block';
            
            // add elements content
            report.querySelector('div > h2').textContent = dayTime
            report.querySelector('div > h3').textContent = data.summary

            // targetting flex items
            var col1 = document.querySelectorAll('.column')[0];
            var col2 = document.querySelectorAll('.column')[1];
            col1.querySelector('div > span > span').textContent = data.temperature.toFixed(0);
            col1.querySelector('div > img').src = `/img/darksky-icons/${data.icon}.png`;
            col1.querySelector('div > img').alt = data.icon;
            col2.querySelectorAll('div > div')[0].querySelector('span').textContent = (data.precipProbability * 100).toFixed(0);
            col2.querySelectorAll('div > div')[1].querySelector('span').textContent = (data.humidity * 100).toFixed(0);
            col2.querySelectorAll('div > div')[2].querySelector('span').textContent = data.windSpeed.toFixed(0);
        })
}

