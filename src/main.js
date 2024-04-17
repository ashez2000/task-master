import 'dotenv/config'

import http from 'node:http'
import app from './app.js'

const main = () => {
  const port = process.env.PORT || 3000
  const server = http.createServer(app)

  server.listen(port, () => {
    console.log('Listening on port:', port)
  })
}

main()
