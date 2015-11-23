# Style

We are using [JavaScript Standard Style](http://standardjs.com/) in all our JavaScript files. Linting for Standard style is included in our test procedure, but you can easily integrate a [Javascript Linter to your favorite editor](http://standardjs.com/#text-editor-plugins).

We heavily use ECMAScript 6 with Babel and encourage you to do so. Object Rest Spread is awesome and arrow functions are also.

We use [JSDoc](http://www.macwright.org/2015/05/15/defense-of-jsdoc.html) so we can have auto-generated documentation like theone in [Turf.js](http://turfjs.org/static/docs/) 

Also, we try to not use var declarations, we mostly use const, for things that aren't supposed to change, and let for things that are supposed to change.

Avoid global variables like you avoid the plague. Also, avoid side effects.  

# What libraries do we use

This project uses heavily [React](https://github.com/facebook/react) and [Redux](https://github.com/rackt/redux).

For the layout, we use [Material UI](www.material-ui.com). We found it to be the most complete React-based interface library and it allows us to not worry too much about visuals. If you're doing new visual features, you most likely will use something from that library.

For routing inside the app, we use [React Router](https://github.com/rackt/react-router) and, for storing the route information in the state, we use [Redux Simple Router](https://github.com/jlongster/redux-simple-router), so routes are stored in the state. 

Our data model is heavily based on OpenStreetMap's model, using a lot of the store code from [iD editor](https://github.com/openstreetmap/iD).

