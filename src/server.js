const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const respTime = require('response-time');
const MongoStore = require('connect-mongo');

//Inicializaciones
const app = express();
require('./config/passport');

//Configuraciones
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
   extname: '.hbs',
   layoutsDir: path.join(app.get('views'), 'layouts'),
   partialsDir: path.join(app.get('views'), 'partials'),
   helpers: require('./helpers/helpersHandlebars'),
   defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(cors());
app.use(respTime());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
   secret: process.env.SESSION_KEY,
   cookie: {
      maxAge: 60000 * 60 * 24,
      secure: false
   },
   resave: true,
   saveUninitialized: true,
   name: 'sessionUser',
   store: MongoStore.create({
      mongoUrl: process.env.MONGO_SESSION,
      dbName: 'sessionUser',
      autoRemove: 'interval',
      autoRemoveInterval: 59
   }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.warning_msg = req.flash('warning_msg');
   res.locals.info_msg = req.flash('info_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});

//Rutas
app.use(require('./routes/index.routes'));
app.use('/c', require('./routes/cajero.routes'));
// app.use('/d', require('./routes/docentes.routes'));
// app.use('/a', require('./routes/admin.routes'));

//Archivos estáticos
app.use(express.static(path.join(__dirname + '/public')));

// Error 404 - Not Found
app.get('*', (req, res) => {
   res.status(404).render('404');
});

module.exports = app;