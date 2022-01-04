const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

const db = knex({
  client: 'postgres',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (req, res) => res.send('The server is up and running.'));
app.post('/signin', signin.signInAuthentication(db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileGet(req, res, db));
app.put('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileUpdate(req, res, db));
app.put('/image', auth.requireAuth, (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', auth.requireAuth, (req, res) => image.handleApi(req, res, db));

let port = process.env.PORT || 3004

app.listen(port, () => {
	console.log(`Server is online and is running on PORT ${port}`);
});
