Mira
====

[![Circle CI](https://circleci.com/gh/digidem/reporter-app.svg?style=shield&circle-token=6f496f8dd7eaa049bcc5dfecd826bb0b9726416b)](https://circleci.com/gh/digidem/reporter-app)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Dependencies](https://www.bithound.io/projects/badges/c4a7caf0-8255-11e5-b411-a594fc03e20f/dependencies.svg)](https://www.bithound.io/github/digidem/reporter-app/master/dependencies/npm)

**PRE-APLHA:** Under heavy development and with limited functionality

**Mira is a mobile app for monitoring and documenting the world around you**. It is built for communities to map and document their territory – how it is used and why it is important to them – and to monitor and document how their lives and territory are being impacted by oil drilling, mining, logging, land invasions, and other environmental threats.

It is designed to be fexible and adaptable: You could use it for:

- citizen science – documenting water samples, invertebrate surveys etc.
- citizen journalism – collecting stories or testimonies
- mapping, including collecting data to update OpenStreetMap.

The app is built around 3 core data types / concepts:

1. **Places:** "This is here." A house, a river, a hunting trail.
2. **Incidents/Events:** "This happened here." Something that happened at a certain location, e.g. an oil spill, a robbery, a meeting. (NB. we are not talking "events" in the Facebook events sense)
3. **Observations:** "I was here and I saw this". We know that a place exists or an event happened because somebody made an observation, whether it was a direct observation – a GPS point and photo – or an indirect observation – an interview with an eye-witness.

The main interaction with the app is creating observations and (optionally) attaching them to a place or incident. Places or incidents are created if they don't already exist in the database. The app is not designed as an editor: instead of updating a place or an incident you add a new observation based on that state of knowledge about that place / incident at that specific moment in time. Maps are dynamic, places come and go and change, and the impacts of an event change over time.

Beyond forms and surveys
------------------------

There are several excellent mobile apps built around creating a digital version of a traditional questionnaire-type field survey. We have used [ODK Collect](https://opendatakit.org/use/collect/) effectively for environmental monitoring and mapping.

However, forms are linear in nature and are slow to navigate, and data entry is slow on mobile devices. We have seen smart phones and tablets being most useful when used as sensors – recording location, photos, audio, video – with additional metadata giving context to the media. Mira aims to reduce the steps to taking a photo or video from the home screen, rather than embedding it within a form.

Each observation can have a long form attached, but we encourage observation forms to be kept small, and instead recommend making several observations at a particular site. Instead of a long, linear form guiding the user through what data to gather, Mira will use contextual suggestions: lists of suggested observations to make, based on where the user is or what process they have just started. E.g. if the user documents a contaminated river then the contextual suggestions will include documenting if there is a source of the spill, signs of oil on the ground, a pipeline nearby, each as a separate observation. The user can choose to move through these suggestions in any order.

Many existing apps are also built around a heirarchical research structure: those gathering the data are not the same as those analysing and using the data. Accessing and analysing previous data gathered can be difficult. Mira is built around a distributed peer-to-peer data model and each device has a replica of all the data. This allows new observations to be linked to existing places and incidents: one of our biggest challenges with community-based monitoring programs has been deciphering which incident new surveys refer to, or whether they are documenting a new event.

Finally, Mira puts maps front and center. The map is built upon [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) which renders data in realtime as it is updated. Everything is attached to a location, rather than having taking a GPS point as a separate step.

Demo
----

Since we are still pre-alpha and Mira is under active development, this may not work at all, and features are far from finished. This is a mobile app, so if you are viewing in a browser resize your browser to a mobile screen size for best results, or use Chrome's [Device Mode](https://developers.google.com/web/tools/chrome-devtools/iterate/device-mode/). On an iPhone you can click the share button and "add to home screen" to use the app full-screen.

[http://lab.digital-democracy.org/reporter-app/](http://lab.digital-democracy.org/reporter-app/)

Installation
------------

Clone the repo:

```sh
git clone https://github.com/digidem/mira-app.git
```

Install dependencies:

```sh
npm install
```

Start development server and view in browser:

```sh
npm run start:nohot && open http://localhost:9966/
```

This is a mobile app so will work best if you use Chrome's [Device Mode](https://developers.google.com/web/tools/chrome-devtools/iterate/device-mode/)

If you want to view on the desktop within a phone screen open [http://localhost:9966/wrapper.html](http://localhost:9966/wrapper.html)

Architecture
------------

Mira is built with [React](https://facebook.github.io/react/) and [Redux](https://github.com/rackt/redux). The underlying data model is based upon the [OpenSteetMap data model](http://wiki.openstreetmap.org/wiki/Elements) with the additional element type, observations, which link to a single node or way. Implementation is inspired by [iD Editor's core data model](https://github.com/openstreetmap/iD/blob/master/ARCHITECTURE.md).

Contributing
------------

Do you want to help? Fantastic! We really need a team of people to bring this app to its full potential. We've tried to make the design as modular as possible, so you should be able to work on a specific component independently to the rest of the app. Don't forget to checkout our [CONTRIBUTING](docs/CONTRIBUTING.md) doc - it includes a few technical details that will make the process a lot smoothier.

1. [Fork this repo](https://help.github.com/articles/fork-a-repo/)
2. Clone locally with `git clone git@github.com:MYUSERNAME/reporter-app.git`
3. Checkout a branch in your local copy `git checkout -b my-new-feature`
4. Add new tests for your new feature in `tests/`
5. Check tests pass with `npm test`
6. Commit your changes with an informative commit message
7. [Submit a pull request](https://help.github.com/articles/using-pull-requests) to this repo

License
-------

Mira is available under the [Mozilla Public License Version 2.0](LICENSE). See the [Mozilla FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) for more information.

Thank you
---------

Development of this app is made possible by grants and support from [Hivos](https://www.hivos.org) and the [University San Francisco de Quito](http://www.usfq.edu.ec/Paginas/Inicio.aspx), [Environmental Investigation Agency](http://eia-global.org), the [DiCaprio Foundation](http://leonardodicaprio.org), and the [Knight Foundation](http://knightfoundation.org).
