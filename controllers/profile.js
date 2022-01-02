const handleProfileGet = (req, res, db) => {
	const {id} = req.params;
	db.select('*').from('users')
	 .where({ id: id})
	 .then(user => {
		 if(user.length) {
			res.json(user[0]);
		 } else {
			 res.status(400).json('Not Found');
		 }
	}).catch( err => res.status(400).json('error not found'));
}

const handleProfileUpdate = (req, res, db) => {
	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;
	db('users')
		.where({ id })
		.update({ age, name, pet })
		.then(resp => {
			if(resp) {
				res.status(200).json("success");
			} else {
				res.status(400).json('User not found')
			}
		}).catch(err => {
			console.error(err);
			res.status(400).json('something went wrong');
		})
}

module.exports = {
	handleProfileGet,
	handleProfileUpdate,
};