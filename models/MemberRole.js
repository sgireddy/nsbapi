var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var MemberRole = new keystone.List('MemberRole', {	
	track: true,
});

MemberRole.add({
    role: {type: String, required: true, index: true, initial: true },
    status: { type: Types.Select, options: 'active, inactive, deleted', default: 'active', index: true }
});

//transform.toJSON(MemberRole);
MemberRole.defaultColumns = 'role, status';
MemberRole.register();

//Hooks needed to validate roles