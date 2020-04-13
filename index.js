const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const fs = require('fs')
let capacityUnit = fs.readFileSync('capacity.json');
let unit = JSON.parse(capacityUnit);
const os = require('os-utils');
const numberThread = 100
let rule = 1
let number = 0
if (fs.existsSync('output.mp4')) {
    fs.unlinkSync('output.mp4')
}
const timeOut = (t) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`Completed in ${t}`)
        }, t)
    })
}
(
    () => {
        os.cpuUsage(async (v) => {
            cpuInit = v
            for (let i = 0; i < numberThread; ++i) {
                number = number + 1
                console.log("Start process: " + (i + 1))
                const startTime = Date.now()
                const process = new FFMpegProgress('-re -stream_loop -1 -i input_1080.mp4 -c:v libx264 -preset veryfast -c:a copy -f mpegts udp://127.0.0.1:9999'.split(' '));
                process.on('progress', async (progress) => {
                    console.log('Speed: ' + progress.speed)
                    os.cpuUsage(value => {
                        if ((Date.now() - startTime) >= 55000 & (progress.speed < 0.97)) {
                            rule = 0
                        }
                        if (!rule) {
                            console.log("-----------------------------------------------------")
                            console.log("Result: ")
                            console.log("Number thread 1080p: " + (number - 1) + "  with veryfast preset")
                            console.log("Capacity: " + Math.floor((number - 1) * unit["1080p"] * 8 / 7) + " unit with superfast preset")
                            console.log("Capacity: " + (number - 1) * unit["1080p"] + " unit with veryfast preset")
                            console.log("Capacity: " + Math.floor((number - 1) * unit["1080p"] * 1 / 3) + " unit with medium preset")
                            console.log("------------------------------------------------------")
                            process.exit(0)
                        }
                        else {
                            console.log("CPU total usage: " + value * 100 + ' %')
                            console.log("Number threads start: " + number)
                        }
                    })
                });
                process.once('end', console.log.bind(console, 'Conversion finished and exited with code'));
                await timeOut(60000)
            }
        })
    }
)();

