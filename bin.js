const benchmark = require('.')
const mode = process.argv[2]
const ffmpeg = process.argv[3]
const inputThread = process.argv[4]
const encoder = process.argv[5]
const preset = process.argv[6]
const output = process.argv[7]
const deviceNumber = process.argv[8]
benchmark(mode, ffmpeg, inputThread, encoder, preset, output, deviceNumber)
