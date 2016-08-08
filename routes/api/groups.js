var async = require('async'),
    keystone = require('keystone'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    _ = require('lodash'),
    //cache = require('../../util/cache.js'),
    Group = keystone.list('Group'), 
    GroupMember = keystone.list('GroupMember'),
    Member = keystone.list('Member'),
    MemberRelation = keystone.list('MemberRelation');

exports.byMember = function(req, res){
    var body = req.body;
    var filteredQuery = {};
    
    if (body.memberId) {
        filteredQuery._id = body.memberId;
    } else if (body.username) {
        filteredQuery.username = body.username;
    } else {
        res.status(400).end('Must provide a user name and password');
    }
    
     GroupMember
     .model
     .find(filteredQuery)
     .populate('group')
     .exec(function (err, m) {
        if (err) {
            return res.apiError('error', err);
        }
        
        return res.send(m); //send array of groups
     });   
};

exports.myGroups = function(req, res){    
    GroupMember.model
    .find()        
    .populate({ path: '_id', match: { 'member':  req.auth.memberId }})    
    .populate([{ path: 'group' }, { path: 'member' }])
    .exec()
    .then(function(data){
        var list = [];
        data.forEach(function(a){
            list.push(a.toJSON());
        });
        var result = _.chain(list)
                    .groupBy("group.id")                    
                    .map(function(item) {                                                
                        var n = {};
                        n.group = item[0].group;
                        n.members = _.map(item, function(i){
                         return { member: i.member, status: i.status, role: i.role };   
                        });
                        return n;                        
                    })
                    .value();
        return res.json(result);            
    })            
    .catch(function(err){
    res.apiError('error', err);  
    });
};

exports.myMembers = function(req, res){
    //MemberRelation.model.find({ 'provider': req.auth.memberId }).populate('member provider').exec()
    MemberRelation.model.find({ 'provider': req.auth.memberId }).populate('member').exec()
    .then(function(all){
        //var details = { members: []};
        var members = [];
        _(all).forEach(function(value) {
            doc = value._doc;
            //if(doc.provider && !details.provider){
            //details.provider = doc.provider.toJSON();
            //}
            //details.members.push(doc.member.toJSON());
            members.push(doc.member.toJSON());
        });        
        console.log(members);
        //return details;
        return res.send(members);
    })
    .catch(function(err){
      res.apiError('error', err);  
    });    
};

exports.list = function (req, res) {
    var body = req.body;
    
    var group = new Group.model();
    var filteredQuery = {};
    
    if (body.groupId) {
        filteredQuery._id = body.groupId;
    } else if (body.name) {
        filteredQuery.name = body.name;
    }    
    else if (body.orgId) {
        filteredQuery.organization = body.orgId;
    }    
     else {
        res.status(400).end('Must provide a user name and password');
    }
    
    Group.model.find(filteredQuery).exec(function (err, groups) {
        if (err) {
            return res.apiError('error', err);
        }
        
        return res.send(groups);
            
            // var groupMember = GroupMember.model();
            // groupMember.group = d;
            // groupMember.token = token;
            // if (body.location) {
            //     var coords = JSON.parse(body.location);
            //     groupMember.gpsAccuracy = coords.accuracy;
            //     groupMember.coords = [coords.longitude, coords.latitude];
            // }
            // groupMember.save(function (err, dh) {
            //     if (err) return res.apiError('error', err);
            //     var user = { Groupid: d._id, name: d.name, status: d.status, avatar: d.avatar, sessionid: dh._id };
            //     var result = {
            //                     token: token,
            //                     Groupid: d._id,
            //                     sessionid: dh._id,
            //                     username: d.name,
            //                     user: user
            //     };
                
            //     //cache.setJSON(dh._id, result, true);                
            //     return res.send(result);
            // });        
    });
};

exports.new = function (req, res) {
    
    var body = req.body;
    var group = new Group.model();
    
    group.name = body.name;
    group.organization = body.organization;
    group.password = body.password;
    group.title = body.title;
    group.type = body.type;
    group.description = body.description; 
    group.members = [{member: body.memberId, roles: 1234, status: 'Active'}];   
    
    group.save(function (err, g) {
        if (err) return res.apiError('error', err);
            //cache.setJSON(dh._id, result, true);
            return res.send(g);
        });    
};

exports.update = function (req, res) {
        
    var data = req.body;    

    Group.model.findById(data._id).exec(function (err, item) {
        
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found'); 
        item.getUpdateHandler(req).process(data, { fields: 'city, metro, categories' }, function (err) {
            if (err) return res.apiError('create error', err);
            //res.apiResponse({ user: item });
            res.send(200);
        });
    });
};