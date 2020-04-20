const { FFMpegProgress } = require('ffmpeg-progress-wrapper');
const os = require('os-utils');
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
      for (let i = 0; i < 100; ++i) {
        number = number + 1
        console.log("Start process: " + (i + 1))
        const startTime = Date.now()
        const process = new FFMpegProgress('-re -stream_loop -1 -i input_1080.mp4 -c:v libx264 -preset superfast -c:a copy -f mpegts udp://127.0.0.1:9999'.split(' '), { cmd: 'ffmpeg' });
        process.on('progress', (progress) => {
          console.log('Speed of ' + (i + 1) + ": " + progress.speed)
          os.cpuUsage(value => {
            if (value > 1) {
              console.log("CPU usage: " + value)
              console.log("-----------------------------------------------------")
              console.log("Number_threads_1080p_veryfast=" + (number - 1))
              console.log("------------------------------------------------------")
              process.exit(0)
            }
            else if ((Date.now() - startTime) >= 5500 & (progress.speed < 0.97)) {
              console.log("-----------------------------------------------------")
              console.log("Number_threads_1080p_veryfast=" + (number - 1))
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
        await timeOut(60000)
      }
    })
  }
)();



