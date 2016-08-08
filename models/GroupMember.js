var keystone = require('keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var GroupMember = new keystone.List('GroupMember', {	
	track: false //,    
    //defaultSort: '-createdAt'
});

GroupMember.add({
    member: { type: Types.Relationship, ref: 'Member', required: true, initial: true },
	group:  { type: Types.Relationship, ref: 'Group', required: true, initial: true },
    //roles:  { type: Types.Relationship, ref: 'MemberRole', multiple: true },
    role: { type: Types.Select, options: 'owner, insider, outsider, member', default: 'member', index: true, ui: true },	
    status: { type: Types.Select, options: 'pending, active, suspended, inactive, orphaned, deleted', default: 'pending', index: true, ui: true }    
});

transform.toJSON(GroupMember, function (rtn){
    rtn.message = "Hello Group Member !!!!!";
});

//transform.toJSON(GroupMember);
GroupMember.defaultColumns = 'group, member, role, status';
GroupMember.register();

//Hooks needed to validate roles