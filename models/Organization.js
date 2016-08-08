var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var Organization = new keystone.List('Organization', {	
	track: true,
});

Organization.add({
	name: { type: String, required: true,  initial: true, index: true },
	type: { type: Types.Select, options: ['family', 'child care', 'senior care', 'training', 'early learning', 'baby sitting'], required: true, initial: true, index: true },
    motto: { type: String },
    description: { type: String, required: true,  initial: true, index: false },
    taxId: { type: String, required: false, index: false },
	address: { type: String },
    phone: { type: String },
    fax: { type: String },
    email: { type: String },
    webSite: { type: String }
});

//transform.toJSON(Organization);
Organization.defaultColumns = 'name, type, motto, description, taxId, address, phone, fax, email, webSite';
Organization.register();