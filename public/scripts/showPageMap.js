const cg = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v10', // style URL
        center: cg.geometry.coordinates, // starting position [lng, lat]
        zoom: 13, // starting zoom
    });

new mapboxgl.Marker()
.setLngLat(cg.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${cg.title}</h3>
        <p>${cg.location}</p>
        `
    )
)
.addTo(map);