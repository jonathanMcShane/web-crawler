import { argv } from 'node:process';
import { crawlPage } from './crawl.js'

async function main() {
    const argument = argv[2]
    if (argv.length < 3) {
        console.log('No website provided...')
        return
    }

    if (argv.length > 3) {
        console.log('Too many arguments provided...')
        return
    }

    const baseUrl = argv[2]

    console.log(`Starting crawl of ${baseUrl}`)

    crawlPage(argument)
}

main()