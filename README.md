Reporter App for Indigenous Communities
=======================================

This is a reporter app we, at [Digital Democracy](https://digital-democracy.org), are making to help indigenous communities in Amazonia report issues with illegal mining, water contamination or just map better their places.

The app is still in initial stages of development, so we are heavily changing all the stuff inside. Expect breaking changes often.

Architectural decisions
-----------------------

Since Amazon (the region, not the company) does not exactly have a great broadband infrastructure, we are having to make the data model inside the app, with a multi-master sync between devices. It's not easy AT ALL, so we welcome any help we can get.

We are using the [OpenStreetMap](http://osm.org) data model with some augmentations, so we can both use OSM data in a easy way and contribute back data to OSM. We are using the iD editor core for the local data store.

The local data is transformed to geoJSON and then *okay, we still haven't figured out this part. We will get there.*
