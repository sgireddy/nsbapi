var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var OrgMember = new keystone.List('OrgMember', {	
	track: true,
});

OrgMember.add({
    member: { type: Types.Relationship, ref: 'Member', required: true, initial: true, index: true },
	org: { type: Types.Relationship, ref: 'Organization', required: true, initial: true, index: true },
    roles: {type: Number }
});

//transform.toJSON(OrgMember);
OrgMember.defaultColumns = 'member, org, roles';
OrgMember.register();

//Hooks needed to validate roles