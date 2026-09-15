# Kiosk

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
## Deployment — Netlify

The Angular app is in the `kiosk` subfolder, so set Netlify's build settings to run
there and serve the SPA:

| Setting | Value |
| --- | --- |
| Base directory | `kiosk` |
| Build command | `npm run build` |
| Publish directory | `dist/kiosk` |

- `kiosk/.nvmrc` pins Node 18 (Angular 15's supported line).
- `kiosk/src/_redirects` (copied into the build output) routes all SPA paths to
  `index.html` so direct visits/refreshes on routes like `/queue` work.
- Deploy from the `master` branch; the site is served at `https://kiosk-skeleton.netlify.app`.

Commit `kiosk/angular.json`, `kiosk/src/_redirects`, and `kiosk/.nvmrc` changes, then
re-deploy from Netlify (or push to `master` to trigger a new deploy).
