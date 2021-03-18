const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const https = require("https")
const http = require("http")
const fs = require("fs")

const config = {
  PORT: 443,
  PORT_HTTP: 80,

  SERVE_FILES: './../examples/'
}

const app = express()

app.use(cors())
app.use(bodyParser.json({limit: "200mb"}))
app.use(bodyParser.urlencoded({limit: "200mb", extended: true}))
app.use(express.static(path.join(__dirname, config.SERVE_FILES)))

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, config.SERVE_FILES + 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const PORT = 443

if (+PORT === 443) {
  const read = fs.readFileSync
  const sslPath = path.join(__dirname, "./serts")

  const httpsOptions = {
    key: read(`${sslPath}private.key`, "utf8"),
    cert: read(`${sslPath}certificate.crt`, "utf8"),
    ca: [read(`${sslPath}ca_bundle.crt`, "utf8"), read(`${sslPath}certificate.crt`, "utf8")],
  }

  https.createServer(httpsOptions, app).listen(PORT, err => {
    console.log(err ? `ERROR: ${err}` : `App is run, port: ${PORT}`)
  })

  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${req.headers["host"]}${req.url}`,
      })
      res.end()
      console.log(`Redirect to: https://${req.headers["host"]}${req.url}`)
    })
    .listen(config.PORT_HTTP, err => {
      err && console.log(`ERROR: ${err}`)
    })
} else {
  app.listen(PORT, err => {
    console.log(err ? `ERROR: ${err}` : `App is run, port: ${PORT}`)
  })
}
