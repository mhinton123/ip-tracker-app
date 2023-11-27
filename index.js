const apiKey = 'at_KXKVqPfFGEpmHMNTP6wN1InnaW5bF'    

renderDetails()

async function renderDetails() {
    const ipDetails = await getIpDetails()
    console.log(ipDetails)
    renderHeaderDetails(ipDetails)
    renderMap(ipDetails)
}


// Get IP details from API
async function getIpDetails() {
    try {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
        const data = await res.json()
        return data
    }
    catch {
        console.error("Cannot retrieve user details")
    }
}
    
function renderHeaderDetails(detailsObj) {
    document.getElementById('ip-address').textContent = detailsObj.ip
    document.getElementById('location').textContent = detailsObj.location.city
    document.getElementById('timezone').textContent = `UTC - ${detailsObj.location.timezone.substring(1)}`
    document.getElementById('isp').textContent = detailsObj.isp
}

function renderMap(detailsObj) {
        const lat = detailsObj.location.lat
        const long = detailsObj.location.lng
        var map = L.map('map').setView([lat, long], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker([lat, long]).addTo(map);

}

    
    