const API_LIST_URL = 'https://api.apis.guru/v2/list.json'
const MAX_DESCRIPTION_LENGTH = 140

async function getAPIs() {
    const response = await fetch(API_LIST_URL)
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }
    const data = await response.json()
    return Object.entries(data)
        .map(([id, api]) => {
            const version = api.versions && api.versions[api.preferred]
            if (!version || !version.info) return null
            const info = version.info
            return {
                API: info.title || id,
                Description: info.description || '',
                Category: (info['x-apisguru-categories'] || ['other']).join(', '),
                Link: (info.contact && info.contact.url) || `https://${id.split(':')[0]}`
            }
        })
        .filter(Boolean)
}

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// Descriptions can contain HTML and markdown, so reduce them to short plain text.
function cleanDescription(text) {
    let plain = String(text)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#*_`>]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    if (plain === '') return 'No description provided.'
    if (plain.length > MAX_DESCRIPTION_LENGTH) {
        plain = plain.slice(0, MAX_DESCRIPTION_LENGTH).replace(/\s+\S*$/, '') + '…'
    }
    return plain
}

function safeLink(url) {
    return /^https?:\/\//i.test(url) ? url : '#'
}

function getAPIhtml(myAPI) {
    const link = safeLink(myAPI.Link)
    const support = link.toLowerCase().startsWith('https://') ? 'Yes' : 'No'
    return `
        <div class='my-api'>
            <div class='my-api-name'><a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(myAPI.API)}</a></div>
            <div class='my-api-description'>${escapeHTML(cleanDescription(myAPI.Description))}</div>
            <div class='my-api-stats my-api-auth'>Category: ${escapeHTML(myAPI.Category)}</div>
            <div class='my-api-stats my-api-https'>HTTPS: ${support}</div>
        </div>
    `
}

function displayAPIs(myAPIs) {
    document.body.innerHTML = `
        <h1 id='title'>API of API's</h1>
        <div class='all-apis'>
            ${myAPIs.map(getAPIhtml).join('')}
        </div>
    `
}

function displayError(error) {
    console.error(error)
    document.body.innerHTML = `
        <h1 id='title'>API of API's</h1>
        <div class='error-message'>
            <p>Sorry, the list of APIs couldn't be loaded right now.</p>
            <p>Please try again later.</p>
            <button type='button' onclick='location.reload()'>Try again</button>
        </div>
    `
}

getAPIs()
    .then(displayAPIs)
    .catch(displayError)
