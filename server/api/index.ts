import express from 'express'
const app = express()

app.get('/', (_, res) => res.status(200).send('Hello World!'))
app.get('/api', (_, res) => res.status(200).send('This is an API!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app

