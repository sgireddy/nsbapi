var keystone = require('keystone'),
    jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

keystone.pre('routes', function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	download: importRoutes('./download'),
	views: importRoutes('./views'),
    api: importRoutes('./api')
};

exports = module.exports = function (app) {
    
    app.options('/api*', function(req, res) {
        res.sendStatus(200);
    });    

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	// Downloads
	app.get('/download/users', routes.download.users);    
    
    // 	// API
    app.use(expressJwt({ secret: process.env.JWT_SECRET,  requestProperty: 'auth' }).unless({ path: ['/api/pub/login', '/api/pub/signup'] }));
    app.all('/api*', keystone.middleware.cors);
    app.get('/api/post/list', keystone.middleware.api, routes.api.posts.list);
    app.post('/api/pub/login', [keystone.middleware.api], routes.api.members.login);
    app.post('/api/pub/signup', [keystone.middleware.api], routes.api.members.signup);
    app.post('/api/me', [keystone.middleware.api], routes.api.members.me);
    app.post('/api/groups', [keystone.middleware.api, keystone.middleware.cors], routes.api.groups.myGroups);
    app.post('/api/members', [keystone.middleware.api, keystone.middleware.cors], routes.api.groups.myMembers);
    app.post('/api/search', [keystone.middleware.api, keystone.middleware.cors], routes.api.members.search);
    app.post('/api/addmember', [keystone.middleware.api, keystone.middleware.cors], routes.api.members.addGroupMember);
    	
	// app.get('/api/post/list', keystone.initAPI, routes.api.posts.list);
	// app.all('/api/post/create', keystone.initAPI, routes.api.posts.create);
	// app.get('/api/post/:id', keystone.initAPI, routes.api.posts.get);
	// app.all('/api/post/:id/update', keystone.initAPI, routes.api.posts.update);
	// app.get('/api/post/:id/remove', keystone.initAPI, routes.api.posts.remove);    

};

// var _ = require('underscore'),
// 	keystone = require('keystone'),
// 	middleware = require('./middleware'),
// 	importRoutes = keystone.importer(__dirname);

// // Common Middleware
// keystone.pre('routes', middleware.initLocals);
// keystone.pre('render', middleware.flashMessages);

// // Import Route Controllers
// var routes = {
// 	views: importRoutes('./views'),
// 	api: importRoutes('./api')
// };

// // Setup Route Bindings
// exports = module.exports = function(app) {
	
// 	// Views
// 	app.get('/', routes.views.index);
// 	app.get('/blog/:category?', routes.views.blog);
// 	app.get('/blog/post/:post', routes.views.post);
// 	app.get('/gallery', routes.views.gallery);
// 	app.all('/contact', routes.views.contact);
	
// 	app.get('/api/post/list', keystone.initAPI, routes.api.posts.list);
// 	app.all('/api/post/create', keystone.initAPI, routes.api.posts.create);
// 	app.get('/api/post/:id', keystone.initAPI, routes.api.posts.get);
// 	app.all('/api/post/:id/update', keystone.initAPI, routes.api.posts.update);
// 	app.get('/api/post/:id/remove', keystone.initAPI, routes.api.posts.remove);
	
// };