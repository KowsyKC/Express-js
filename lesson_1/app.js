const express= require('express')
const app= express()
const path= require('path')
const cors= require('cors')
const corsOptions= require('./config/corsOptions')

const {logger}= require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const { json } = require('express')
const PORT= process.env.PORT || 3500;

// custom middleware
app.use( logger)

app.use(cors(corsOptions))

//middleware
app.use(express.urlencoded( {extended: false}))
app.use(express.json())

app.use('/', express.static(path.join(__dirname,'./public') ))
//app.use('/subdir', express.static(path.join(__dirname,'./public') ))

app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

/*
//routes chaining
app.get('/hello(.html)?', (req, res,next) =>{
   console.log('we try to access hello.html file')
   next();
}, (req,res) =>{
   res.send('hello express js')
})

const one= (req, res,next) =>{
   console.log('one')
   next()
}
const two= (req, res,next) =>{
   console.log('two')
   next()
}
const three= (req, res,next) =>{
   console.log('three')
   res.send('finished')
}

app.get('/chain(.html)?', [one,two,three] ) */

app.all('*', (req, res) =>{
   res.status(404)
   if(req.accepts('html')) {
      res.sendFile(path.join(__dirname,'webServer', '404.html'))
   } else if(req.accepts('json')) {
      res.json({"error": "404 Not Found"})
   }else{
      res.type('txt').send("404 not found")
   }
})

app.use(errorHandler)

app.listen(PORT,() => console.log('server is running on port'))