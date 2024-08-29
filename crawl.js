import { JSDOM } from 'jsdom'

function normalizeURL(url) {

    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

function getURLsFromHTML(html, baseURL) {

    const urls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')
    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href')

            try {
                // convert any relative URLs to absolute URLs
                href = new URL(href, baseURL).href
                urls.push(href)
            } catch (err) {
                console.log(`${err.message}: ${href}`)
            }
        }
    }
    return urls
}

async function crawlPage(currentUrl) {
    // Fetch and parse the html of the currentUrl
    console.log(`Crawling ${currentUrl}`)

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

    // Read and log the HTML content properly
    const htmlContent = await response.text()  // Await the response text here
    console.log(htmlContent)  // This will log the HTML content

}

export { normalizeURL, getURLsFromHTML, crawlPage };