const apiKey = 'at_KXKVqPfFGEpmHMNTP6wN1InnaW5bF'
let map
let marker

const searchBtn = document.getElementById('search-btn')
const inputField = document.getElementById('searchbar-input')

loadPage()
async function loadPage() {
    const ipDetails = await getUserIpDetails(false)
    renderHeaderDetails(ipDetails)
    initializeMap(ipDetails)
}


searchBtn.addEventListener('click', handleSearchBtn)

async function handleSearchBtn(e){
    
    const ipAddress = inputField.value
    
    if (checkValidIpAddress(ipAddress)) {
        renderDetails(ipAddress)
    }
}

function checkValidIpAddress(ipAddress) {
    
    const octets = ipAddress.split('.')
    let isValid = true
    
    // Check addres contains 4 octects
    if (octets.length !== 4) {
        isValid = false
    }

    for (let octet of octets) {
        // Check each octect conatins only numbers and lenth between 1 - 3
        if (!(/^\d+$/.test(octet))) {
            isValid = false
        }
        if (!(octet.length >= 1 && octet.length <= 3)) 
            isValid = false
        }

    return isValid
}

async function renderDetails(ipAddress) {
    const ipDetails = await getUserIpDetails(ipAddress)
    renderHeaderDetails(ipDetails)
    renderMap(ipDetails)
}


// Get IP details from API
async function getUserIpDetails(ipAddress) {
    console.log(ipAddress)
    if (ipAddress) {
        try {
            const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`)
                const data = await res.json()
                return data
            }
            catch {
                console.error("Cannot retrieve user details")
            }
    }
    else {
        try {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
            const data = await res.json()
            return data
        }
        catch {
            console.error("Cannot retrieve user details")
        }
    }
    
}
    
function renderHeaderDetails(detailsObj) {
    document.getElementById('ip-address').textContent = detailsObj.ip
    document.getElementById('location').textContent = detailsObj.location.city
    document.getElementById('timezone').textContent = `UTC - ${detailsObj.location.timezone.substring(1)}`
    document.getElementById('isp').textContent = detailsObj.isp
}

function initializeMap(detailsObj) {
        const lat = detailsObj.location.lat
        const long = detailsObj.location.lng
        map = L.map('map').setView([lat, long], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    marker = L.marker([lat, long]).addTo(map);

}

function renderMap(detailsObj) {
    const lat = detailsObj.location.lat
    const long = detailsObj.location.lng
    map.setView([lat, long], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([lat, long]).addTo(map);

}

    
    