mapboxgl.accessToken =
    "pk.eyJ1IjoibWloaXJwZXRrYXIiLCJhIjoiY21jaHBrNXIxMHoxZTJrbXliMDZpMGRoNCJ9.TfYhG6KMRHfj0lhTfkxhaw";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [78.9629, 20.5937],
    zoom: 3.5,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

const stores = [
    { name: "StyleHub Mumbai", coords: [72.8777, 19.076] },
    { name: "StyleHub Delhi", coords: [77.1025, 28.7041] },
    { name: "StyleHub Bangalore", coords: [77.5946, 12.9716] },
    { name: "StyleHub Chennai", coords: [80.2707, 13.0827] },
    { name: "StyleHub Hyderabad", coords: [78.4867, 17.385] },
];

stores.forEach((store) => {
    const el = document.createElement("div");
    const img = document.createElement("img");
    img.src = "./images/markerLogo.svg";
    img.width = 36;
    img.height = 48;
    img.style.display = "block";
    el.appendChild(img);
    el.style.cursor = "pointer";
    el.style.width = "36px";
    el.style.height = "48px";

    new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(store.coords)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<strong>${store.name}</strong><br/>Click to visit this store`,
            ),
        )
        .addTo(map);
});

function buyNow(productName) {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            window.location.href =
                "geo.html?lat=" +
                lat +
                "&lng=" +
                lng +
                "&product=" +
                encodeURIComponent(productName);
        },
        function (err) {
            var msgs = {
                1: "Permission denied. Please allow location access to proceed.",
                2: "Location information is unavailable.",
                3: "Location request timed out.",
            };
            alert(msgs[err.code] || "An unknown error occurred.");
        },
    );
}
