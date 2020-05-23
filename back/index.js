const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/routes')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/trelloDB', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const corsOptions = {
  exposedHeaders: ['x-auth'],
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(
  bodyParser.json({
    limit: '50mb',
  })
)

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.get('/', (request, response) => {
  response.json('testas')
})

app.use('/trello', router)

app.listen(3000)
