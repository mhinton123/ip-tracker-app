const apiKey = '63bfa48cfc667b0b5d8ce1f5a9ee824d'
const ipAddress = '94.6.232.147'

fetch(`http://api.ipstack.com/${ipAddress}?access_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        const lat = data.latitude
        const long = data.longitude
        var map = L.map('map').setView([lat, long], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
    })

