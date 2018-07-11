const {spawn} = require('child_process')
const fs = require('fs')

const [watchedFolder] = process.argv.slice(2)

fs.watch(watchedFolder, function () {
  const overmind = spawn('overmind', ['restart', 'example'])

  overmind.stdout.on('data', data => console.log(data.toString()))
  overmind.stderr.on('data', data => console.error(data.toString()))
})
