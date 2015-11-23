# Contributing to Mira

Hi! Thank you for your interest in contributing to MIRA, we really appreciate it.

There are many ways to contribute – reporting bugs, feature suggestions, fixing bugs, submitting pull requests for enhancements.

## Reporting Bugs, Asking Questions, Sending Suggestions

Just [file a GitHub issue](https://github.com/digidem/reporter-app/issues/new), that’s all. If you want to prefix the title with a “Question:”, “Bug:”, or the general area of the application, that would be helpful, but by no means mandatory. If you have write access, add the appropriate labels.

If you’re filing a bug, specific steps to reproduce are helpful. Please include screenshots and, if possible, include the URL of the page that has the bug, along with what you expected to see and what happened instead.

Here is a [handy link for submitting a new bug](https://github.com/digidem/reporter-app/issues/new?body=Photo%3A%0A%0AURL%3A%0A%0AWhat+I+expected%3A%0A%0ASteps+to+reproduce%3A%0A%0AWhat+happened+instead%3A&title=Description%20of%20the%20problem).

## Installing Mira Locally

If you’d like to contribute code, first, you will need to run Mira locally. Here is the short version:

1.	Make sure you have `git`, `node`, and `npm` installed.
2.	Clone this repository locally.
3.  Execute `npm install` from the root directory of the repository.
4.	Execute `npm start` from the root directory of the repository.
5.	Open `http://127.0.0.1:9966` in your browser.

## Development Workflow

### Build

Running `npm start` will build all the code and continuously watch the project for changes and rebuild accordingly. In the case of React components, after the rebuild, the code is reloaded live in the browser and you should be able to see the changes without a refresh (changes deeper in the logic still need a refresh, but this will change, soon). In case you're dealing with the map view, the map view does not work with hot-reloading. In that case, run `npm run start:nohot`

### Errors and Warnings

Errors and warnings appear in the normal places – the terminal where you ran `npm start` and the JavaScript console in the browser. If something isn’t going the way you expected it, look at those places first.


### Style

We are using [JavaScript Standard Style](http://standardjs.com/) in all our JavaScript files. Linting for Standard style is included in our test procedure, but you can easily integrate a [Javascript Linter to your favorite editor](http://standardjs.com/#text-editor-plugins).

We heavily use ECMAScript 6 with Babel and encourage you to do so. Object Rest Spread is awesome and arrow functions are also.

We use [JSDoc](http://www.macwright.org/2015/05/15/defense-of-jsdoc.html) so we can have auto-generated documentation like theone in [Turf.js](http://turfjs.org/static/docs/) 

Also, we try to not use var declarations, we mostly use const, for things that aren't supposed to change, and let for things that are supposed to change.

Avoid global variables like you avoid the plague. Also, avoid side effects.  

### What libraries do we use

This project uses heavily [React](https://github.com/facebook/react) and [Redux](https://github.com/rackt/redux).

For the layout, we use [Material UI](www.material-ui.com). We found it to be the most complete React-based interface library and it allows us to not worry too much about visuals. If you're doing new visual features, you most likely will use something from that library.

For routing inside the app, we use [React Router](https://github.com/rackt/react-router) and, for storing the route information in the state, we use [Redux Simple Router](https://github.com/jlongster/redux-simple-router), so routes are stored in the state. 

Our data model is heavily based on OpenStreetMap's model, using a lot of the store code from [iD editor](https://github.com/openstreetmap/iD).

### We’re Here To Help

We encourage you to ask for help at any point. We want your first experience with Mira to be a good one, so don’t be shy. If you’re wondering why something is the way it is, or how a decision was made, you can tag issues with **<span class="label type-question">[Type] Question</span>** or prefix them with “Question:”.
