import { argv, report } from 'node:process';
import { crawlPage } from './crawl.js'
import { printReport } from './report.js'

async function main() {
    // If there is no CLI argument provided, log an error, exit
    if (argv.length < 3) {
        console.log('No website provided...')
        return
    }

    // If there are too many CLI arguments provided, log an error, exit
    if (argv.length > 3) {
        console.log('Too many arguments provided...')
        return
    }

    // Setting the baseUrl to the argument provided
    const baseUrl = argv[2]

    console.log(`Starting crawl of ${baseUrl}`)

    // Crawling the pages, constructing a map of each link visited
    const pages = await crawlPage(baseUrl)

    // Converting the map into a report and logging it.
    printReport(pages)

}

main()