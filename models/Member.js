var keystone = require('keystone'),
    _ = require('lodash');
var transform = require('../util/transform');
var Types = keystone.Field.Types;

var Member = new keystone.List('Member', 
    {
        track: true,
	    autokey: { path: 'slug', from: 'username', unique: true },
        map: { name: 'username' },
        defaultSort: '-createdAt'
});

Member.add({
    firstname: { type: String, required: true, initial: true, index: true, ui: true },
    lastname: { type: String, required: true, initial: true, index: true, ui: true }, 
	//name: { type: Types.Name, required: true, initial: true, index: true, ui: true },
	username: { type: String, required: true, initial: true, index: true, unique: true, ui: true },
    email: { type: Types.Email, displayGravatar: true, ui: true },
    phone: { type: String, initial: false, required: false, index: true, ui: true },
    DoB: { type: Types.Date, initial: true, required: true, index: true, ui: true },
	password: { type: Types.Password,  required: true, initial: true },
    searchcode: {type: Number, initial: false, required: false, index: false, ui: true },
	parentMember: { type: Types.Relationship, ref: 'Member', required: false, initial: false, index: true },
    //type: { type: String, required: true,  initial: true, index: true },
	//type: { type: String, required: true,  initial: true, index: true },
    //type: { type: Types.Select, options: 'parent, caregiver, infant, child, teen, senior, pet', default: 'parent', index: true },
    status: { type: Types.Select, options: ['active', 'suspended', 'inactive', 'orphaned', 'deleted'], default: 'active', index: true, ui: true },
    avatar: { type: Types.Url, initial: false, required: false, ui: true }
});

Member.relationship({path: 'groupmembers', ref: 'GroupMember', refPath: 'member'});

transform.toJSON(Member, function (rtn){
    rtn.message = "Hello Member !!!!!";
});

//Member.schema.plugin(transform);

Member.defaultColumns = 'firstname, lastname, username, email, DoB,  phone, status';
Member.register();