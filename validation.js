// validation.js 0.3.0
// (c) 2017 Costas Vlahakis, Pixacore
// Licensed under the MIT license.

var validator = require('validator');

module.exports = function(requirements, val){
	var err;

	if(requirements.required && val === undefined){
		return 'Missing, when required';
	}

	switch(requirements.type){
		case 'string':
			if( !(val === undefined || typeof val === 'string') ){
				err = 'Not a string';
				break;
			}
			if(requirements.size){
				if(requirements.size.min && (val === undefined || val.length < requirements.size.min)){
					err = 'Below min. size';
					break;
				}
				if(requirements.size.max && (val !== undefined && val.length > requirements.size.max)){
					err = 'Above max. size';
					break;
				}
			}
			break;
		case 'number':
			if( !(val === undefined || typeof val === 'number') ){
				err = 'Not a number';
				break;
			}
			if(requirements.size){
				if(requirements.size.min && (val === undefined || val < requirements.size.min)){
					err = 'Below min. size';
					break;
				}
				if(requirements.size.max && (val !== undefined && val > requirements.size.max)){
					err = 'Above max. size';
					break;
				}
			}
			break;
		case 'email':
			if(val !== undefined && !validator.isEmail(val)){
				err = 'Invalid email';
				break;
			}
			break;
		case 'enum':
			if(val !== undefined && requirements.values.indexOf(val) === -1){
				err = 'Invalid enum';
				break;
			}
			break;
		case 'date':
			if(val !== undefined && !(val instanceof Date)){
				err = 'Invalid date';
				break;
			}
			break;
		case 'boolean':
			if(typeof val !== 'boolean'){
				err = 'Not a boolean';
				break;
			}
			break;
		case 'free-form':
			// anything goes
			break;
		default:
			throw new Error('Invalid schema type: ' + requirements.type);
	}

	if(err){
		return err;
	}
};
