function printReport(pages) {
    console.log(`Report is starting...`)
    const sortedPages = sortPages(pages)
    for (const [link, count] of sortedPages) {
        console.log(`Found ${count} internal links to ${link}`)
    }
    console.log(`Reporting finished`)
}

function sortPages(pages) {
    // Converting the sortedPages object into a sorted array
    return Object.entries(pages).sort((a, b) => b[1] - a[1])
}

export { printReport }