const router = require('express').Router()
const { isValidObjectId } = require('mongoose');
const Character = require('../models/Character.model')
/**
 * !All the routes here are prefixed with /api/characters
 */

/**
 * ? This route should respond with all the characters
 */
router.get('/', async (req, res, next) => {
	/**Your code goes here */
	try {
		const allCharacters = await Character.find();
		res.status(200).json(allCharacters);
	} catch (error) {
		next(error)
	}
})

/**
 * ? This route should create one character and respond with
 * ? the created character
 */
router.post('/', async (req, res, next) => {
	try {
		const { name, occupation, cartoon, weapon } = req.body;
		const errorMessages = [];
		if (!name) errorMessages.push('name');
		if (!occupation) errorMessages.push('occupation');
		if (cartoon === undefined) errorMessages.push('cartoon');
		if (!weapon) errorMessages.push('weapon');
		if (errorMessages.length) return res.send(errorMessages);

		const newCharacter = { name, occupation, cartoon, weapon };
		const createdCharacter = await Character.create(newCharacter);
		res.status(201).json(createdCharacter);
	} catch (error) {
		next(error);
	}
	
})

/**
 * ? This route should respond with one character
 */
router.get('/:id', async (req, res, next) => {
	try {
		const character = await Character.findById(req.params.id);
		console.log(character);
		res.status(200).json(character);
	} catch (error) {
		next(error)
	}
})

/**
 * ? This route should update a character and respond with
 * ? the updated character
 */
router.patch('/:id', async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!isValidObjectId(id)) return res.send('Character not found');

		const { name, occupation, cartoon, weapon } = req.body;
		const updatedCharacterData = {};
		if (name) updatedCharacterData.name = name;
		if (occupation) updatedCharacterData.occupation = occupation;
		if (cartoon !== undefined) updatedCharacterData.cartoon = cartoon;
		if (weapon) updatedCharacterData.weapon = weapon;

		const updatedCharacter = await Character.findByIdAndUpdate(id, updatedCharacterData, {new: true});
		if (updatedCharacter) res.json(updatedCharacter);
		else res.send('Character not found')
	} catch (error) {
		console.log(error)
	}
})

/**
 * ? Should delete a character and respond with a success or
 * ? error message
 */
router.delete('/:id', async (req, res, next) => {
	try {
		const deletedChar = await Character.findByIdAndDelete(req.params.id);
		if (deletedChar) res.send("Character has been successfully deleted");
		else res.send("Character not found");
	} catch (error) {
		next(error);
	}
})

module.exports = router
