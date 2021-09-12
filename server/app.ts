import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcryptjs'
import { writeFile, readFileSync } from 'fs'

const app = express();
const port = 3002;
dotenv.config();

interface User {
  name: string;
  email: string;
  password: string;
  uid: string,
  createdAt: Date;
};

interface Note {
  encrypted: string,
  authorId: string,
  createdAt: Date
  isEdited: boolean,
  id: number
}

const allowedOrigins = ['http://localhost:8080'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
}

app.use(cors(options))
app.use(express.json())

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const bearerHeader =  req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
 
    next()
  } else {
    res.sendStatus(401)
  }
}


app.post('/register', (req: Request, res: Response) => {
  if (req.body) {
    const { name, email, password, createdAt } = req.body
    const formattedUID = name.replace(/\s/g, "_").toLowerCase()
    const user = {
      name,
      email,
      password: password,
      createdAt,
      uid: formattedUID
    } as User

    const dbUsers = require('../src/data/users.json')['dbUsers']
    const isEmailExist = dbUsers.find((user: User) => user.email === email)

    if (isEmailExist) {
      res.status(401).json({ error: 'An account with this email already exists.' })
      return
    } else {  
      dbUsers.push(user)
      const strJSON = JSON.stringify({dbUsers})
      writeFile('../src/data/users.json', strJSON, 'utf8', error => {
       if (error) {
        console.log(error)
       } else {
         const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN)
         res.json({
           token,
           name,
           email,
           uid: user.uid
         })
       }
      })
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/login', (req: Request, res: Response) => {
  const user = readFileSync('../src/data/users.json', { encoding:'utf8' })
  const { dbUsers } = JSON.parse(user)
  const { email, password } = req.body
  const findUser = dbUsers.find((user: User) => user.email === email && user.password === password)
  // const passMatch = bcrypt.compareSync(password, findUser.password)

  // if (!passMatch) return res.status(401).json({error: 'Password is invalid'})

  if (req.body && findUser) {
    const token = jwt.sign(findUser, process.env.ACCESS_SECRET_TOKEN)
    res.json({
      token,
      name: findUser.name,
      email: findUser.email,
      uid: findUser.uid
    })

  } else {
    res.status(401).json({ error: 'Invalid login. Please try again.' })
  }
})

app.get('/notes', authenticateToken, (req: any, res: Response) => {
  jwt.verify(req.token, process.env.ACCESS_SECRET_TOKEN, error => {
    if (error) {
      res.sendStatus(401)
    } else {
      const notes = require('../src/data/api.json')['notes']
      res.json({
        notes: notes
      })
    }
  })
})

// app.patch('/note/:id', authenticateToken, (req: any, res: Response) => {
//   jwt.verify(req.token, process.env.ACCESS_SECRET_TOKEN, error => {
//     if (error) {
//       res.sendStatus(401)
//     } else {
//       res.json({
//         notes: notes
//       })
//     }
//   })
// })


app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});