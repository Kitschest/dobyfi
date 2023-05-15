const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dobyfi';

mongoose.connect(MONGODB_URI, {
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
})
.then(() => console.log(`Successfully connected to the database ${MONGODB_URI}`))
.catch((error) => console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}: `, error));
