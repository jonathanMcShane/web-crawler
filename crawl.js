import { JSDOM } from 'jsdom'

function normalizeURL(nextUrl) {

    const urlObj = new URL(nextUrl)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

function getURLsFromHTML(html, baseURL) {

    const nextUrls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')
    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href')

            try {
                // convert any relative URLs to absolute URLs
                href = new URL(href, baseURL).href
                nextUrls.push(href)
            } catch (err) {
                console.log(`${err.message}: ${href}`)
            }
        }
    }
    return nextUrls
}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {

    // If the hostnames don't match, exit immediately
    const currentUrlObj = new URL(currentUrl)
    const baseUrlObj = new URL(baseUrl)
    if (currentUrlObj.host !== baseUrlObj.host) {
        return pages
    }

    // Use a consistent URL format
    const normalizedUrl = normalizeURL(currentUrl) // Normalize the current URL

    // Updating the pages object.
    // If this page has already had an entry, exit now
    if (pages[normalizedUrl]) {
        pages[normalizedUrl]++
        return pages
    }

    // If this is a new page, inialize it in the map, and continue with the execution.
    pages[normalizedUrl] = 1

    // Fetch and parse the HTML of the current URL
    let html = ''
    try {
        html = await fetchHTML(currentUrl) // Get HTML for current URL
    } catch (err) {
        console.log(err.message)
        return pages
    }

    const nextUrls = getURLsFromHTML(html, currentUrl) // Get all the links in the fetched HTML

    for (const nextUrl of nextUrls) {
        pages = await crawlPage(baseUrl, nextUrl, pages) // For each link, recursively call Crawl Page
    }

    return pages
}

async function fetchHTML(currentUrl) {
    let response

    try {
        response = await fetch(currentUrl)
    } catch (err) {
        throw new Error(`Network error: ${err.message}`)
    }

    if (response.status >= 400) {
        console.log(`Error Code: ${response.status} ${response.statusText}`)
        return
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('text/html')) { // If the content-type header does not start with text/html, log an error
        console.log(`Error - Got non-HTML response: ${contentType}`)
        return
    }

    // Await the call to text() to return the HTML as a string.
    return await response.text()
}

export { normalizeURL, getURLsFromHTML, crawlPage };