const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({
	url: process.env.REDIS_URI
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const handleSignIn = (db, bcrypt, req, res) => {
	const{email, password} = req.body;
	if(!email || !password) {
		Promise.reject('invalid form submission')
	}
	
	return db.select('hash','email').from('login')
	 .where('email', '=', email)
	 .then(data =>{
		 const isValid = bcrypt.compareSync(password, data[0].hash);
		 if(isValid) {
			 return db.select('*').from('users')
			  .where('email', '=', email)
			  .then(user => user[0])
			  .catch(err => Promise.reject('user not found'))
		 } else {
			 Promise.reject('invalid credentials');
		 }
	 })
	 .catch(err => {
		 console.log(err);
		 Promise.reject('invalid credentials');
	 });
}

const getAuthTokenId = async(req, res) => {
	const { authorization } = req.headers;
	const id = await redisClient.get(authorization);
	if(!id) {
		return await res.status(400).json("Unauthorized");
	}
	return await res.json({id});
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value, {
		EX: 60 * 10,
		NX: true
	}))
}

const createSessions = (user) => {
	const {email, id} = user;
	const token = signToken(email);
	
	return setToken(token, id)
		.then(() => ({
			success: "true",
			userId: id,
			token,
		}))
		.catch(console.log)
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	console.log(authorization)
	return authorization 
		? getAuthTokenId(req, res) 
		: handleSignIn(db, bcrypt, req, res)
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data);
			})
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err));
}

module.exports = {
	handleSignIn: handleSignIn,
	signInAuthentication,
	redisClient,
};