# QC Overlay (Web)
This project aims to provide Quake Champions streamers with a simple
overlay system for displaying information from the stats API into their
streams using a very simple system.

## How to use ##
At the moment these are static pages. It should be straightforward to
modify the index to your needs.

To test this, start a local webserver (python is a good option) and navigate
to localhost:PORT/?name=foo to test the layout for the QC profile "foo".
You must provide a query parameter for the profile name for most elements
to work.

## Goals for this Project ##
This system alone is very simple, but easily extended and flexible.
I can imagine this system being extended to support serving pages dynamically.
This is a longer term goal and would have many complications. For now I aim to
provide a few standard layout formats served statically somewhere, and to encourage
savvy people to play with this themselves and share what they make.
