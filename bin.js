const benchmark = require('.')
let configFile = process.argv[2]
let capacityFile = process.argv[3]
benchmark(configFile, capacityFile)
