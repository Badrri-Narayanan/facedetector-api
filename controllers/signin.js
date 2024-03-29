const jwt = require('jsonwebtoken');

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

const retrieveUserProfile = (id, db, res) => {
	let userInfo;
	db.select('*').from('users')
	 .where({ id: id})
	 .then(user => {
		 if(user.length) {
			userInfo = user[0];
			return res.json({
				id,
				userInfo,
			})
		 } else {
			 return res.status(400).json('Not Found');
		 }
	}).catch( err => {
		return res.status(400).json('error not found');
	});
}

const getAuthTokenId = async (db, req, res) => {
	const { authorization } = req.headers;
	let id = -1;
	try {
        let decoded_value = jwt.verify(authorization, process.env.JWT_SECRET);
		id = decoded_value.id;
    } catch(err) {
        console.error("authoriztion unsuccessful " + err)
        return res.status(401).json('Unauthorized');
    }

	retrieveUserProfile(id, db, res);
}

const signToken = (id) => {
	const jwtPayload = { id };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '600000' });
}

const createSessions = (userData) => {
	const {id} = userData;
	const token = signToken(id);

	return {
		success: "true",
		userId: id,
		token,
		userInfo: userData,
	}
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	
	return authorization 
		? getAuthTokenId(db, req, res) 
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
};