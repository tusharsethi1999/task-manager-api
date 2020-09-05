const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // next()
//     if(req.method === 'GET') {
//         res.send('Get Requests are disabled')
//     } else {
//         next()
//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware');
// }

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word Document!'))
//         }

//         cb(undefined, true)

//         // cb(new Error('File must be a PDF!'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })


app.use(express.json()) // to parse all json data automatically
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ', port)
})

// const Task = require('./models/task')
// const User = require('./models/user')
//
// const main = async () => {
//     // 5f3b86dc654fdf3700adc07b
//     // const task = await Task.findById('5f3b86dc654fdf3700adc07b')
//     // await task.populate('author').execPopulate()
//     // console.log(task.author)
//
//     const user = await User.findById('5f3ac20488f8cf14a061156d')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
//
// main()

// const pet = {
//     name: 'HansSolo'
// }

// pet.toJSON = function() {
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const authToken = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn : '7 days'})
//     console.log(authToken)

//     const data = jwt.verify(authToken, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()