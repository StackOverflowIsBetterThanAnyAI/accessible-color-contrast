#!/usr/bin/env node

import { main } from './main.js'

main(process.argv).catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
})
