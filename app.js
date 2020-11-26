const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagem')
require('./models/Categoria')
const Categoria = mongoose.model('categoria')
const usuarios = require('./routes/usuario')
const passport = require('passport')
const { json } = require('body-parser')
require('./config/auth')(passport)
const db = require('./config/db')

//////
app.use(session({
	secret: 'cursodenode',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//////
app.use(flash())

app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
	res.locals.error = req.flash("error")
	res.locals.user = req.user || null
	// console.log(`Text = ${res.locals.user}`)
	// var obj = JSON.stringify(req.user)
	// console.log(`Text = ${obj}`)
	// adminObj = JSON.parse(obj)
	// res.locals.eAdmin = adminObj.eAdmin || null
	next()
})

//////
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

//////
app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

//////
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}).then(() => { 
		console.log('Conectado ao Mongo DB ' + db.mongoURI)
	}).catch((err) => {
		console.log('Errooooooow = ' + err)
})

//////
app.use(express.static(path.join(__dirname,'public')))

//////
app.get('/', (req,res) => {
	Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
		res.render('index', {postagens: postagens})
	}).catch((err) => {
		req.flash('error_msg', 'Houve um erro interno')
		res.redirect('/404')
	})
})

app.get('/postagem/:slug' , (req,res) => {
	Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
		if(postagem){
			res.render('postagem/index', {postagem: postagem})
		} else {
			req.flash('error_msg', 'Esta postagem não existe')
			res.redirect('/')
		}
	}).catch((err) => {
		req.flash('error_msg', 'Houve um erro interno')
		res.redirect('/')
	})
})

app.get('/categorias', (req,res) => {
	Categoria.find().lean().then((categorias) => {
		res.render('categorias/index', {categorias: categorias})
	}).catch((err) => {
		req.flash('error_msg', 'Houve um erro interno sobre as categorias!')
	})
})

app.get('/categorias/:slug', (req,res) => {
	Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
		if (categoria) {
			Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
				res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
			}).catch((err) => {
				req.flash('error_msg', 'Esta categoria não existe')
				res.redirect('/')
			})

		} else {
			req.flash('error_msg', 'Esta categoria não existe')
			res.redirect('/')
		}
	}).catch((err) => {
		req.flash('error_msg', 'Houve um erro interno sobre esta categoria!')
	})
})

app.get('/404', (req,res) => {
	res.send('Erro 404!<br> NOT FOUND!')
})

app.use('/admin', admin)

app.use('/usuarios', usuarios)

const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
	console.log('Servidor rodando! http://localhost:8081')
})