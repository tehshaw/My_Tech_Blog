
const express = require('express');
const path = require('path')
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
//-------------------------
// Router path file
//-------------------------
const routes = require('./controllers')
const PORT = process.env.PORT || 3001;

const app = express();
//------------------------------------
// Handlebars path to the views files.
//------------------------------------
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  helpers,
  defaultLayout: 'main',
  partialsDir: 'views/partials/'
});
//==============================================
//express-session configs for user on connection
//==============================================
const session = require('express-session')

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'secret phrase',
  cookie: {maxAge: 600000}, // Cookie lasts for 10 mins before it is deleted.
  resave: true,             // Saves session to store  marking it active.
  rolling: true,            // Reset the cookie maxAge every time user makes new requests(User won't have to relog after 10mins if they are active on the site)
  saveUninitialized: true,  // Keep track of recurring users.
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess))





//--------------------------
// Express middleware
//--------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//----------------------------------------------
// Call handlebars to be used as the view engine
//----------------------------------------------
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);
//-----------------------------------------------------------------------------
// Turns PORT into a server and syncs Database specified from .env file.
//-----------------------------------------------------------------------------
sequelize.sync({ force: false, logging: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening http://localhost:${PORT}`));
  });

