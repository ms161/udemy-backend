const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGOOSE_URI).then(() => {
  console.log('Db connected Sucessfull')
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
