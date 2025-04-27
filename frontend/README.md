# Card Game Documentation

## Routing

"/" redirect to: "/home" => **home** component (protected) </br>
"/game" => **game** component (protected) </br>
"/login" => **login** component </br>
"/register" => **register** component <br/>
If `localStorage` has no `token`, redirect to "/login".

## Services

- `api.service` for api fetching from **server** with `HttpClient` (asynchronious by nature).
- `auth.service` for api fetching from **ssoServer** with `HttpClient`.
- `calc-force` for dynamic total force calculation of all cards within a deck.

## Components

### Custom types:

`Card`, `Deck`, `Profile` </br>

### Pages:

- home
- game
- login
- register

Order of redirection:

- "/" => "/home"
- if not nogged in => "/login"
- on login page, option for registration => "/registration"
- on registration page, option for login => "/login"
- when logged in, home is available. "play" redirect to => "/game"
- neither "game", nor "home" are available when not logged in.

### UI components:

- `app.component` holds `<router-outlet>`
- `home` components contains child `deck-` and `card-list` components.
- Child `enity-list` displays a list of parent component entities: `card-list` & `decks-list`.
  - Click an item name: opens sidenav with a dynamic child `entity-form` form fields to edit, delete, close, ...
  - Optionally render multi-selects input logic for cards in deck with `TemplateRef`.
- `confirm-dialogue` is a shared yes/no verifictaion dialogue.
- `header` is a repeatable component that is shared over multiple pages.
- `game` component contains all game elements. Can be partitioned further into repeatable components further down the line.

## Guards

`authGuard` protects "home" and "game" routes.

# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
