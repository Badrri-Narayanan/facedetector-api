const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
  client: 'postgres',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

db.select('*').from('users').then(data => {console.log});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {res.send('The server is running')});
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)});
app.put('/image', (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleApi(req, res, db)});

app.listen(process.env.PORT, () => {
	console.log(`Server is online and is running on PORT ${process.env.PORT}`);
});
