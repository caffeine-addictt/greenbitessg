<!-- Allow inline html -->
<!-- markdownlint-disable MD033 -->

<!-- Ignore line length -->
<!-- markdownlint-disable MD013 -->

<!-- Disable top-level heading -->
<!-- markdownlint-disable MD041 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/caffeine-addictt/nyp_y2_fullstack">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Fullstack</h3>

  <p align="center">
    Nanyang Poly y2 DIT Fullstack
    <br />
    <br />
    <a href="https://github.com/caffeine-addictt/nyp_y2_fullstack/issues">Report Bug</a>
    ·
    <a href="https://github.com/caffeine-addictt/nyp_y2_fullstack/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul><li><a href="#built-with">Built with</a></li></ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#documentation">Documentation</a>
      <ul>
        <li><a href="#installing-dependencies">Installing Dependencies</a></li>
        <li><a href="#running-locally">Running locally</a></li>
        <li><a href="#linting">Linting</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#building">Building</a></li>
        <li><a href="#running-commands">Running commands</a></li>
      </ul>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
      <ul>
        <li><a href="#commit-message-guidelines">Commit Message Guidelines</a></li>
        <li><a href="#pull-request-guidelines">Pull Request Guidelines</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![Social Card](images/socialcard.png)

later

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built with

These are the major frameworks and libraries used in this project.

- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
- ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
- ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you can set up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node v21.6.1
- NPM v10.4.0

### Installation

_Below is an example of how you can install the project locally._

#### 1. Clone the Repository

```sh
git clone https://github.com/caffeine-addictt/nyp_y2_fullstack
cd nyp_y2_fullstack
```

#### 2. Install Dependencies

```sh
npm i # This will install all workspace dependencies as well
```

#### 3. Run Development Server

```sh
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DOCS -->

## Documentation

You can find the front-end app in the `client/` directory and the back-end API in the `server/` directory.
API types are shared in the `shared/api-types/` directory and can be imported with `npm i -D @repo-utils/api-types`.

### Installing dependencies

```sh
npm i # Install dependencies on all packages
```

### Running locally

```sh
npm run dev        # Run development server on all packages
npm run dev:client # Run development server on client
npm run dev:server # Run development server on server
```

### Linting

```sh
npm run lint        # Run linting on all packages
npm run lint:client # Run linting on client
npm run lint:server # Run linting on server
```

```sh
npm run lint:fix        # Run linting on all packages and fix any linting errors
npm run lint:client:fix # Run linting on client and fix any linting errors
npm run lint:server:fix # Run linting on server and fix any linting errors
```

### Testing

```sh
npm run test        # Run tests on all packages
npm run test:client # Run tests on client
npm run test:server # Run tests on server
```

### Building

```sh
npm run build        # Build all packages
npm run build:client # Build the client
npm run build:server # Build the server
```

### Running commands

We use NPM workspaces to share updates to the client and server packages.
You can use the `-w` flag to run a command in a workspace with the path.

#### For example:

```sh
npm i tailwindcss -w server # Installs the tailwindcss package in the server workspace
npm i -D eslint -w shared/api-types # Installs the eslint package in the shared/api-types workspace as a dev dependency
npm uninstall vite -w client # Uninstalls the vite package in the client workspace
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. ( ˶ˆᗜˆ˵ )

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- COMMIT GUIDELINES -->

### Commit Message Guidelines

When committing, commit messages are prefixed with one of the following depending on the type of change made.

- `feat:` when a new feature is introduced with the changes.
- `fix:` when a bug fix has occurred.
- `chore:` for changes that do not relate to a fix or feature and do not modify _source_ or _tests_. (like updating dependencies)
- `refactor:` for refactoring code that neither fixes a bug nor adds a feature.
- `docs:` when changes are made to documentation.
- `style:` when changes that do not affect the code, but modify formatting.
- `test:` when changes to tests are made.
- `perf:` for changes that improve performance.
- `ci:` for changes that affect CI.
- `build:` for changes that affect the build system or external dependencies.
- `revert:` when reverting changes.

A parenthesis can be placed after the type of change to indicate the scope of the change. Below list some example commit messages.

```sh
git commit -m "docs(client): Updated README.md in client/"
git commit -m "revert(server): Fall back to old typing"
git commit -m "docs: Moved README.md"
```

See the [open issues](https://github.com/caffeine-addictt/nyp_y2_fullstack/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PR GUIDELINES -->

### Pull Request Guidelines

When creating a pull request, please use our PR template and follow the checklist provided.

We require the following CI to pass before the PR can be merged:

- Linting
- Tests

#### Linting locally

You can lint locally by running `npm run lint` in the root of the project, then run `npm run lint:fix` to automatically fix any linting errors.

#### Testing locally

You can test locally by running `npm run test` in the root of the project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE.txt](./LICENSE.txt) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Jun Xiang - [contact@ngjx.org](mailto:contact@ngjx.org)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Repository Template](https://github.com/caffeine-addictt/template)
- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
- [Malven's Grid Cheatsheet](https://grid.malven.co/)
- [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
