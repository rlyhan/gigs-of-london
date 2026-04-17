## Project Overview

Gigs of London: A single-page application to find live music events in London, UK.

## Features

- Find events in London on any given date
- Map centered upon London that places all the events in clickable and hoverable pins, allowing you to access a modal that links to the event ticketing page
- Select a mood to get an AI-generated list of recommended events

## APIs Used

- Events: Ticketmaster API
- Map: Mapbox
- Event suggestions: OpenAI SDK

## Event Data

From the Ticketmaster API, we pull in the following data about each event:
- Title
- Image
- Venue location
- Event date + time
- Link to purchase tickets
- Description

A lot of the time, the description is non-existent, and when there is one it only displays information about event-specific details like age restrictions and venue entry conditions.