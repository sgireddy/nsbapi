var keystone = require('keystone');
var Types = keystone.Field.Types;

var ActivityCategory = new keystone.List('ActivityCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Categories',
});

ActivityCategory.add({
	name: { type: String, required: true },
});

ActivityCategory.relationship({ ref: 'Activity', refPath: 'category' });

ActivityCategory.track = true;
ActivityCategory.register();
