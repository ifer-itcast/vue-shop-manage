const path = require('path')
const express = require('express')
const app = express()
const compression = require('compression')

app.use(compression())
app.use(express.static(path.join(__dirname, '..', 'dist')))

app.listen(8088, () => {
  console.log('server running at http://127.0.0.1:8088')
})
