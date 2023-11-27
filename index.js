const apiKey = 'at_KXKVqPfFGEpmHMNTP6wN1InnaW5bF'
const searchBtn = document.getElementById('search-btn')
const inputField = document.getElementById('searchbar-input')
const popupMessage = document.getElementById('popupMessage');
let marker
let map

// Loads Users current location as default
loadPage()
async function loadPage() {
    const ipDetails = await getIpDetails(false)
    renderHeaderDetails(ipDetails)
    initializeMap(ipDetails)
}

searchBtn.addEventListener('click', handleSearchBtn)

async function handleSearchBtn(e){
    
    const ipAddress = inputField.value
    
    if (checkValidIpAddress(ipAddress)) {
        renderDetails(ipAddress)
    }
    else {
        showPopup('Invalid IP Address')
    }
}

function checkValidIpAddress(ipAddress) {
    
    const octets = ipAddress.split('.')
    let isValid = true
    
    // Check address contains 4 octects
    if (octets.length !== 4) {
        isValid = false
    }

    for (let octet of octets) {
        const parsedOctet = parseInt(octet, 10)
        // Check octect conatins only numbers
        if (!(/^\d+$/.test(octet))) {
            isValid = false
        }
        // Check octet length is between 1 - 3
        if (!(octet.length >= 1 && octet.length <= 3)) {
            isValid = false
        }
        //Check octect is between 1 - 255
        if (isNaN(parsedOctet) || parsedOctet < 1 || parsedOctet > 255) {
            isValid = false
        }

    }

    return isValid
}

async function renderDetails(ipAddress) {
    const ipDetails = await getIpDetails(ipAddress)
    
    // Only render details if details are valid
    if (ipDetails) {
        renderHeaderDetails(ipDetails)
        renderMap(ipDetails)
    }
}


// Get IP details from API
async function getIpDetails(ipAddress) {
    
    // If true, sends a request with an IP, if false... will make request with users current IP
    if (ipAddress) {
        try {
            const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`)
            const data = await res.json()
            if (checkValidResponse(data)){
                return data
            }
            else {
                return false
            }
        }
        catch {
            console.error("Cannot retrieve user details")
        }
    }
    else {
        try {
            const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`)
            const data = await res.json()
            if (checkValidResponse(data)){
                return data
            }
            else {
                return false
            }
        }
        catch {
            console.error("Cannot retrieve user details")
        }
    }
    
}
    
function renderHeaderDetails(detailsObj) {
    
    const ipAddress = detailsObj.ip
    const location = detailsObj.location.city
    const timezone = detailsObj.location.timezone.substring(1)
    const isp = detailsObj.isp

    document.getElementById('ip-address').textContent = ipAddress
    document.getElementById('location').textContent = location
    document.getElementById('timezone').textContent = `UTC - ${timezone}`
    document.getElementById('isp').textContent = isp


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

function checkValidResponse(detailsObj) {
    
    const ipAddress = detailsObj.ip
    const location = detailsObj.location.city
    const timezone = detailsObj.location.timezone.substring(1)
    const isp = detailsObj.isp

    if (location !== '' && timezone !== '' && isp !== '') {
        return true
    }
    else {
        showPopup('IP Address not found')
        return false
    }
}






  
// Function to show the popup message
function showPopup(msg) {
    popupMessage.textContent = msg
    popupMessage.style.display = 'block';
    setTimeout(() => {
    popupMessage.style.opacity = '1';
    }, 10);

    // Hide the popup after 3 seconds
    setTimeout(() => {
    popupMessage.style.opacity = '0';
    setTimeout(() => {
        popupMessage.style.display = 'none';
    }, 300);
    }, 3000);
}
