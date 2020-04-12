const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const fs = require('fs')
const os = require('os-utils');
const numberThread = 8
let cpuInit = 0
let rule = 1
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
                const process = new FFMpegProgress('-re -stream_loop -1 -i input_480.mp4 -c:v libx264 -preset superfast -c:a copy -f mpegts udp://127.0.0.1:9999'.split(' '));
                process.on('progress', async (progress) => {
                    console.log('Speed: ' + progress.speed)
                    os.cpuUsage(value => {
                        const checkLimitCPU = value + (value - cpuInit) / numberThread
                        if (progress.speed < 0.9) {
                            rule = 0
                        }
                        if (!rule) {
                            console.log("This number thread is not available!!!")
                            console.log("This speed: " + progress.speed)
                        }
                        else {
                            if (checkLimitCPU > 1) {
                                console.log("CPU Usage maximum!")
                                console.log('CPU init: ' + cpuInit * 100 + ' %')
                                console.log("CPU Usage for " + numberThread + " process ffmpeg: " + (value - cpuInit) * 100 + ' %')
                                console.log("CPU total usage: " + value * 100 + ' %')
                            }
                            else {
                                console.log('CPU init: ' + cpuInit * 100 + ' %')
                                console.log("CPU Usage for " + numberThread + " process ffmpeg: " + (value - cpuInit) * 100 + ' %')
                                console.log("CPU total usage: " + value * 100 + ' %')
                                let count = 0
                                while ((count + 1) * (value - cpuInit) / numberThread + cpuInit < 1) {
                                    ++count
                                }
                                console.log("Expect can add " + count + " threads (this is based % CPU usage)")
                                console.log("Expect total number thread: " + (count + numberThread))
                            }
                        }
                    })
                });
                process.once('end', console.log.bind(console, 'Conversion finished and exited with code'));
                await timeOut(5000)
            }
        })
    }
)();

