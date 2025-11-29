import express, { urlencoded } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './infra/routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(express.json())

app.use(router)

export { app }
