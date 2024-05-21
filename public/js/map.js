mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: JSON.parse(coordinates), // starting position [lng, lat]
    zoom: 9 // starting zoom
});

console.log(coordinates);

const el = document.createElement('div');
const width = 40;
const height = 40;
el.className = 'marker';
el.style.backgroundImage = `url(${imageUrl})`;
el.style.width = `${width}px`;
el.style.height = `${height}px`;
el.style.backgroundSize = '100%';


const marker = new mapboxgl.Marker(el)
    .setLngLat(JSON.parse(coordinates))
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${title}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);
