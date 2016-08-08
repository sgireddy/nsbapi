var keystone = require('keystone');
var transform = require('../util/transform');
var Types = keystone.Field.Types;

var Group = new keystone.List('Group', {	
	track: true,
    autokey: { path: 'slug', from: 'name', unique: true },
    map: { name: 'name' },
    defaultSort: '-createdAt'
});


Group.add({
	name: { type: String, required: true, index: true, ui: true },    
    //organization: { type: Types.Relationship, ref: 'Organization' },	    
    type: { type: Types.Select, options: ['family', 'child care', 'senior care', 'training', 'early learning', 'baby sitting'], required: true, initial: true, index: true, ui: true },
    //title: { type: String, initial: true },
    description: { type: String, required: true, initial: true, index: false, ui: true }    
});

Group.relationship({path: 'groupmembers', ref: 'GroupMember', refPath: 'group'});

transform.toJSON(Group, function (rtn){
    rtn.message = "Hello Group !!!!!";
});
Group.defaultColumns = 'name, type, title, description';
Group.register();