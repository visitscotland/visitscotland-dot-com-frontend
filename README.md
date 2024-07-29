# Nuxt 3 Minimal Starter for Bloomreach Headless

Provides a minimal starting point for a nuxt app using the VisitScotland Component Library and the Bloomreach Headless CMS.

## Setup

```
yarn
yarn dev
yarn build      # Build For production
node .output/server/index.mjs       # Execute production build locally
```

In order to get the app connected to an instance of the bloomreach resource API a .env file is required. This can also be used to place the application into debug mode, giving slightly clearer error messages in dev mode.

```
BR_RESOURCE_API_ENDPOINT=http://businessevents.local:8080/site/resourceapi
BR_CMS_ORIGIN_LOCATION=*
BR_NUXT_APP_DEBUG=false
```

## Structure

Configuration for the nuxt instance is all set within `nuxt.config.ts`, including a number of settings necessary to work with the component library. It pulls in all of the non-icon css from the library which is then loaded on every page (and passed into the user's cache) and some sub-dependencies are pulled out and transpiled into the nuxt app which ended up being necessary to get it all working properly. The core of the nuxt app, handled by the library files in /.nuxt, is then booted up through app.vue. In addition, this automatically imports everything in /server, /plugins, /utils and /composables. From within plugins, the brsdk.js plugin ensures that the application is loading the bloomreach spa-sdk code to connect to the back end.

That app.vue file makes the connection to the resourceApi endpoint based on the current site path, gathers the response, and then starts page construction by passing the relevant information to each of the components in /components/Base which render out the site in full.

By default, whenever there is a 500 error message in the page, nuxt loads a very user-unfriendly error page with full details of that error. In order to prevent that reaching our end-users we also have an error.vue page. This is called every time something goes wrong in the execution of app.vue, and displays a generic "something has gone wrong" type error message to the user, using a dummy version of the VsBrMain called VsBrErrorMain. In development this can sometimes be problematic and get in the way of debugging. If that is the case, rename error.vue to anything else and the default nuxt crash error will be restored with all of its information.
