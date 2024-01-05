const express = require('express');
const app = express();
const connectDB = require('./config/db')
console.log("calling connect DB");
connectDB() // establishing connection to the database

//initialising the middleware (body parser to read data from form)
app.use(express.json({extended:false}))
const port = 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  console.log("Till here is fine");
  app.use('/api/user',require('./routes/api/user'));
  app.use('/api/authuser',require('./routes/api/authuser'));
 
  app.use('/api/admin',require('./routes/api/admin'));
  app.use('/api/authadmin',require('./routes/api/authadmin'));
  // console.log("go on");
  app.use('/api/topic',require('./routes/api/topic'));
  app.use('/api/subject',require('./routes/api/subject'));
  app.use('/api/exam', require('./routes/api/exam'));
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });