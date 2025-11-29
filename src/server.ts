import { app } from './app'
import { env } from '@/env'

app.listen(env.PORT, () => {
  console.log('Server is running on http://localhost:3333')
})
