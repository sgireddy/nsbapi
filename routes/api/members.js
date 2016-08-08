var async = require('async'),
    keystone = require('keystone'),
    Promise = require('bluebird'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    _ = require('lodash'),
    //cache = require('../../util/cache.js');
    Member = keystone.list('Member'),
    GroupMember = keystone.list('GroupMember'),
    MemberHistory = keystone.list('MemberHistory');    
    mongoose.Promise = require('bluebird');

function onGetMember(body){
    var user = {};
    user.token = jwt.sign({
            username: body.member.username,
            memberId: body.member._id
            }, process.env.JWT_SECRET);
    user.member = body.member.toJSON();   
    var memberHistory = MemberHistory.model();
    memberHistory.member = body.member._id;
    memberHistory.token = user.token;
    if (body.location) {
        var coords = JSON.parse(body.location);
        memberHistory.gpsAccuracy = coords.accuracy;
        memberHistory.coords = [coords.longitude, coords.latitude];
    }
    return memberHistory.save().then(function(dh){        
        user.sessionId = dh._id;
        body.user = user;        
        return body;
    });        
}
function compare(body) {
    return new Promise(function(resolve, reject){
        body.member._.password.compare(body.password, function (err, isMatch){
            if(!err && isMatch) {
                return resolve(body);
            } else {
                return reject(err);
            }
        });
    });
}

function getMember(body){
    if (!body.username || !body.password) {
        throw('Must provide a user name and password');
    } 
    var filteredQuery = { };
    filteredQuery.username = body.username;    
    return Member.model.findOne(filteredQuery).exec().then(function(m){
        var ui = m.toJSON();
        console.log(ui);
        console.log(m._id);         
        body.member = m;        
        return body;
    });        
}
exports.me = function (req, res) {
    var body = req.body;
    if (body.sessionid) {
        cache.get(body.sessionid)
            .then(function (result) {
                res.send(result);
            });
    } else {
        return res.apiError('Session Expired, please login again.');
    }   
};
exports.login = function (req, res) {
    getMember(req.body)
    .then(compare)
    .then(onGetMember)    
    .then(function(body){
        res.send(body.user);
    })
    .catch(function(err) {
        res.apiError('error', err);
    }); 
};
exports.signup = function (req, res) {
    var member = new Member.model(req.body);        
    return member.save()
    .then(function(m){
        req.body.member = m;
        return req.body;
    })
    .then(compare)
    .then(onGetMember)    
    .then(function(body){
        res.send(body.user);
    })
    .catch(function(err) {
        res.apiError('error', err);
    });
};
exports.updateProfile = function (req, res) {      
    var data = req.body;    
    Member.model.findById(data._id).exec(function (err, item) {        
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found'); 
        item.getUpdateHandler(req).process(data, { fields: 'city, metro, categories' }, function (err) {
            if (err) return res.apiError('create error', err);
            //res.apiResponse({ user: item });
            res.send(200);
        });
    });
};
exports.search = function  (req, res) {
var body = req.body;
    if (body.str) {
        Member.model.find({username: new RegExp(body.str, 'i')})
        .then(function(data) {
            var list = [];
            data.forEach(function(a){
                list.push(a.toJSON());
            });
            return res.json(list);
        })
        .catch(function(err) {
            res.apiError('error', err);
        });
    } else {
        return res.apiError('Search Failed');
    }   
};

exports.addGroupMember= function  (req, res) {
var body = req.body;
    if (body.group && body.member) {
        req.body.status = "pending";
        req.body.role = "member";
        var member = new GroupMember.model(req.body);        
        return member.save()
        .then(function(m){
            res.sendStatus(200);
        })        
        .catch(function(err) {
            res.apiError('error', err);
        });
    } else {
        return res.apiError('Invalid member or group');
    }   
};
/* --old approach.....
exports.login = function (req, res) {
    
    if (!req.body.username || !req.body.password) {
        return res.status(400).end('Must provide a user name and password');
    }
    
    var filteredQuery = {}, user = {};
    filteredQuery.username = req.body.username;    
    
    Member.model.findOne(filteredQuery).exec()
    .then(function (d) {
        return new Promise(function(resolve, reject){
            d._.password.compare(req.body.password, function (err, isMatch){
                if(!err && isMatch) {
                    return resolve(d);
                } else {
                    return reject(err);
                }
            });  
        }); 
    })
    .then(function(d) {        
        user.token = jwt.sign({
            id: d._id,                
        }, process.env.JWT_SECRET);        
        user.member = { Memberid: d._id, name: d.name, status: d.status, avatar: d.avatar };        
        var memberHistory = MemberHistory.model();
        memberHistory.member = d;
        memberHistory.token = user.token;
        if (req.body.location) {
            var coords = JSON.parse(req.body.location);
            memberHistory.gpsAccuracy = coords.accuracy;
            memberHistory.coords = [coords.longitude, coords.latitude];
        }
        return memberHistory.save();            
    })
    .then(function(dh){
            user.sessionid = dh._id;            
            //cache.setJSON(dh._id, result, true);                
            return res.send(user);
    })
    .catch(function(err) {
        res.apiError('error', err);
    });    
};

exports.signup = function (req, res) {
    var member = new Member.model(req.body);
    var user = {};    
    return member.save()
    .then(function(d){
        user.token = jwt.sign({
            username: req.body.username
        }, process.env.JWT_SECRET);
        user.member = { Memberid: d._id, name: d.name, status: d.status, avatar: d.avatar };
        var memberHistory = MemberHistory.model();
        memberHistory.member = d;
        memberHistory.token = user.token;
        if (req.body.location) {
            var coords = JSON.parse(req.body.location);
            memberHistory.gpsAccuracy = coords.accuracy;
            memberHistory.coords = [coords.longitude, coords.latitude];
        }
        return memberHistory.save();
    })
    .then(function(dh){
            user.sessionid = dh._id;            
            //cache.setJSON(dh._id, result, true);                
            return res.send(user);
    })
    .catch(function(err) {
        res.apiError('error', err);
    });
};

exports.updateProfile = function (req, res) {
        
    var data = req.body;    

    Member.model.findById(data._id).exec(function (err, item) {
        
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found'); 
        item.getUpdateHandler(req).process(data, { fields: 'city, metro, categories' }, function (err) {
            if (err) return res.apiError('create error', err);
            //res.apiResponse({ user: item });
            res.send(200);
        });
    });
};
*/
