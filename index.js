const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const fs = require('fs')
const os = require('os-utils');

function benchmark(filePath, fileCapacity) {
    const capacityUnit = fs.readFileSync(fileCapacity);
    const conf = fs.readFileSync(filePath)
    const unit = JSON.parse(capacityUnit);
    const config = JSON.parse(conf)
    let rule = 1
    let number = 0
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
                for (let i = 0; i < config["numberThread"]; ++i) {
                    number = number + 1
                    console.log("Start process: " + (i + 1))
                    const startTime = Date.now()
                    const process = new FFMpegProgress('-re -stream_loop -1 -i $input -c:v $encoder -preset $preset -c:a copy -f mpegts udp://127.0.0.1:9999'.replace("$input", config['inputThread']).replace("$encoder", config['encoder']).replace('$preset', config['preset']).split(' '));
                    process.on('progress', async (progress) => {
                        console.log('Speed of ' + (i + 1) + ": " + progress.speed)
                        os.cpuUsage(value => {
                            if ((Date.now() - startTime) >= config['timeCheckStable'] & (progress.speed < config['speedCheck'])) {
                                rule = 0
                            }
                            if (!rule) {
                                console.log("-----------------------------------------------------")
                                console.log("Number_threads_1080p_veryfast=" + (number - 1))
                                console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                                console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                                console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                                console.log("------------------------------------------------------")
                                process.exit(0)
                            }
                            else {
                                console.log("CPU total usage: " + value * 100 + ' %')
                                console.log("Number threads start: " + number)
                                console.log("Thread: " + (i + 1))
                            }
                        })
                    });
                    process.once('end', console.log.bind(console, 'Conversion finished and exited with code'));
                    await timeOut(config["timeAddProcess"])
                }
            })
        }
    )();

}


module.exports = benchmark
