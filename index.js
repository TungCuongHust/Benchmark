const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const fs = require('fs')
const os = require('os-utils');
const fileCapacity = './capacity.json'
const filePath = './config.json'

const unit = {
  "1080p": 40,
  "720p": 20,
  "480p": 10,
  "360p": 4,
  "240p": 3,
  "144p": 1
}
const config = {
  "numberThread": 100,
  "timeCheckStable": 25000,
  "speedCheck": 0.97,
  "timeAddProcess": 30000
}
const numberThreadMax = config["numberThread"]
const timeAddProcess = config["timeAddProcess"]
const timeCheckStable = config["timeCheckStable"]
const speedCheck = config["speedCheck"]

function benchmark(mod, ffmpeg, inputThread, encoder, pre, output, deviceNumber) {
  const mode = mod.toLowerCase()
  const preset = pre.toLowerCase()
  let number = 0
  const timeOut = (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Completed in ${t}`)
      }, t)
    })
  }
  (
    async () => {
      os.cpuUsage(async (v) => {
        cpuInit = v
        for (let i = 0; i < numberThreadMax; ++i) {
          number = number + 1
          console.log("Start process: " + (i + 1))
          const startTime = Date.now()
          if (mode == "cpu") {
            const process = new FFMpegProgress('-re -stream_loop -1 -i $input -c:v $encoder -preset $preset -c:a copy -f mpegts $output'.replace("$input", inputThread).replace("$encoder", encoder).replace('$preset', preset).replace('$output', output).split(' '), { cmd: ffmpeg });
            process.on('progress', async (progress) => {
              console.log('Speed of ' + (i + 1) + ": " + progress.speed)
              os.cpuUsage(value => {
                if (value > 0.7) {
                  if (preset == "veryfast") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_veryfast=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "superfast") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_veryfast=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "medium") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_medium=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else {
                    console.log("---------------------------------")
                    console.log(`Number_thread_1080p_${preset}= ${(number - 1)}`)
                    console.log("---------------------------------")
                    process.exit(0)
                  }
                }
                else if ((Date.now() - startTime) >= timeCheckStable & (progress.speed < speedCheck)) {
                  if (preset == "veryfast") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_veryfast=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "superfast") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_veryfast=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "medium") {
                    console.log("-----------------------------------------------------")
                    console.log("Number_threads_1080p_medium=" + (number - 1))
                    console.log("Result_capacity_unit_superfast=" + Math.floor((number - 1) * unit["1080p"] * 8 / 7))
                    console.log("Result_capacity_unit_veryfast=" + (number - 1) * unit["1080p"])
                    console.log("Result_capacity_unit_medium=" + Math.floor((number - 1) * unit["1080p"] * 1 / 3))
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else {
                    console.log("---------------------------------")
                    console.log(`Number_thread_1080p_${preset}= ${(number - 1)}`)
                    console.log("---------------------------------")
                    process.exit(0)
                  }
                }
                else {
                  console.log("CPU total usage: " + value * 100 + ' %')
                  console.log("Number threads start: " + number)
                  console.log("Thread: " + (i + 1))
                }
              })
            });
            process.once('end', console.log.bind(console, 'Conversion finished and exited with code'));
            await timeOut(timeAddProcess)
          }
          else if (mode == "gpu") {
            const process = new FFMpegProgress('-hwaccel cuvid -hwaccel_device $deviceNumber -c:v h264_cuvid -i $input -preset $preset -vcodec $encoder -acodec copy -f mpegts $output'.replace("$input", inputThread).replace("$encoder", encoder).replace('$preset', preset).replace("$deviceNumber", deviceNumber).replace("$output", output).split(' '), { cmd: ffmpeg });
            process.on('progress', async (progress) => {
              console.log('Speed of ' + (i + 1) + ": " + progress.speed)
              os.cpuUsage(value => {
                if (value > 0.7) {
                  if (preset == 'll') {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_llhq=${Math.floor((number - 1) * 18 / 17)}`)
                    console.log(`Number_threads_1080p_llhp=${Math.floor((number - 1) * 16 / 17)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == 'llhq') {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_ll=${Math.floor((number - 1) * 17 / 18)}`)
                    console.log(`Number_threads_1080p_llhp=${Math.floor((number - 1) * 16 / 18)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "llhp") {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_llhq=${Math.floor((number - 1) * 18 / 16)}`)
                    console.log(`Number_threads_1080p_ll=${Math.floor((number - 1) * 17 / 16)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else {
                    console.log("------------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                }
                else if ((Date.now() - startTime) >= timeCheckStable & (progress.speed < speedCheck)) {
                  if (preset == 'll') {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_llhq=${Math.floor((number - 1) * 18 / 17)}`)
                    console.log(`Number_threads_1080p_llhp=${Math.floor((number - 1) * 16 / 17)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == 'llhq') {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_ll=${Math.floor((number - 1) * 17 / 18)}`)
                    console.log(`Number_threads_1080p_llhp=${Math.floor((number - 1) * 16 / 18)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else if (preset == "llhp") {
                    console.log("CPU usage: " + value)
                    console.log("-----------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log(`Number_threads_1080p_llhq=${Math.floor((number - 1) * 18 / 16)}`)
                    console.log(`Number_threads_1080p_ll=${Math.floor((number - 1) * 17 / 16)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                  else {
                    console.log("------------------------------------------------------")
                    console.log(`Number_threads_1080p_${preset}=${(number - 1)}`)
                    console.log("------------------------------------------------------")
                    process.exit(0)
                  }
                }
                else {
                  console.log("CPU total usage: " + value * 100 + ' %')
                  console.log("Number threads start: " + number)
                  console.log("Thread: " + (i + 1))
                }
              })
            });
            process.once('end', console.log.bind(console, 'Conversion finished and exited with code'));
            await timeOut(timeAddProcess)
          }
          else {
            console.log('This mode option is not Invalid!')
            console.log('Option mode is cpu or gpu (lowercase)')
          }
        }
      })
    }
  )();

}


module.exports = benchmark
