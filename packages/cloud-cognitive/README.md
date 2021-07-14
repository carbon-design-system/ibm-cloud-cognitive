# @carbon/ibm-cloud-cognitive

> ibm-cloud-cognitive is an open-source implementation of the closed source
> ibm-cloud-cognitive pattern asset library (PAL). These PAL designs build on
> the foundation of the IBMs open source Carbon Design System and React
> implementation to offer components and patterns beyond the typical component
> library.

[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
[![Licensed under the Apache License, Version 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/carbon-design-system/ibm-cloud-cognitive/blob/master/LICENSE)
[![Build status](https://github.com/carbon-design-system/ibm-cloud-cognitive/workflows/ci/badge.svg)](https://github.com/carbon-design-system/ibm-cloud-cognitive/actions?query=workflow%3Aci)
[![Netlify status](https://img.shields.io/netlify/19d81e71-7987-4124-8a3a-36e051486e6b)](https://app.netlify.com/sites/ibm-cloud-cognitive/deploys)
[![GitHub Lerna version](https://img.shields.io/github/lerna-json/v/carbon-design-system/ibm-cloud-cognitive)](https://lerna.js.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/carbon-design-system/ibm-cloud-cognitive/blob/master/.github/CONTRIBUTING.md)

> Carbon for Cloud & Cognitive common UI components

## 🚀 Getting started

If you're just getting started and looking to browse our React components, take
a look at [our Storybook](https://ibm-cloud-cognitive.netlify.app).

## 📦 Installing IBM Cloud Cognitive

To use IBM Cloud Cognitive components, all you need to do is install the
`@carbon/ibm-cloud-cognitive` package.

```shell
$ yarn add @carbon/ibm-cloud-cognitive

# or

$ npm install @carbon/ibm-cloud-cognitive
```

Then you can import the component styles in your `index.js`.

```js
import '@carbon/ibm-cloud-cognitive/css/index.min.css';
```

### Carbon Components (Peer dependencies)

@carbon/cloud-cognitive is built on top of Carbon components and has a number of
dependencies which need to be installed. Follow the package instructions for:

-. Install carbon-components-react as per that packages instructions
<https://www.npmjs.com/package/carbon-components-react> -. Install
@carbon/icons-react as per package instructions
<https://www.npmjs.com/package/@carbon/icons-react> -. Install @carbon/elements
as per package instructions <https://www.npmjs.com/package/@carbon/elements>

NOTE: Carbon elements rolls up a number of Carbon packages that could be
installed independently. As this list of dependencies could change, we leave you
to view package.json in ibm-cloud-cognitive if you wish to install individual
packages.

## Examples

### Codesandbox

Examples for each released component, and some that are still not quite ready,
can be found here on
[Code Sandbox](https://codesandbox.io/examples/package/@carbon/ibm-cloud-cognitive).
Or try searching code sandbox for ibm-cloud-cognitive.

### Packages

You can find example projects using the components in
[examples folder](../../packages/examples/cloud-cognitive).

## Usage

To start using the components

```jsx
import { AboutModal } from '@carbon/ibm-cloud-cognitive';

const App = () => {
  return <AboutModal />;
};
```

## Enabling canary components

Components that have not yet completed the release review process are considered
to be canary and require the consumer to enable via a feature flag in a
`config.js` file.

For example, create a `config.js` in your `src` directory:

```js
import { pkg } from '@carbon/ibm-cloud-cognitive';

// Enable 'canary' (not yet reviewed/released) components
// that we want to make use of
pkg.component.AboutModal = true;
pkg.component.SidePanel = true;

// Live dangerously: enable all components!
pkg.setAllComponents(true);

// Enable all pre-release feature flags that we want to use
pkg.flags.noneJustYet = true;

// Live dangerously: enable all pre-release features!
pkg.setAllFeatures(true);
```

**Note:** the above settings must happen before a component first renders.

## Building and running Locally

To get started run the following commands and storybook will be built and then
served on port `3000` on your local machine.

```
yarn install
yarn storybook
```

To build all the packages, run the following command.

```
yarn build
```

## Browser Support

This library supports the latest versions of:

- Apple Safari
- Google Chrome
- Microsoft Edge
- Mozilla Firefox

## 🙌 Contributing

This project was made possible by several community members who have invested
their precious time to give back to the Carbon community. It will continue to be
possible by having those that benefit from the package contribute back to it.

So, do not be shy. We both depend on and appreciate contributors, new and old,
who help us fix bugs, build new features, improve our documentation, etc.

If you're interested, definitely check out our
[Contributing Guide](https://github.com/carbon-design-system/ibm-cloud-cognitive/blob/master/.github/CONTRIBUTING.md)
and
[Carbon's Developer Handbook](https://github.com/carbon-design-system/carbon/blob/master/docs/developer-handbook.md)!
👀

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/lee-chase"><img src="https://avatars0.githubusercontent.com/u/15086604?v=4" width="100px;" alt=""/><br /><sub><b>Lee Chase</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=lee-chase" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dcwarwick"><img src="https://avatars.githubusercontent.com/u/6385315?v=4" width="100px;" alt=""/><br /><sub><b>Dave Clark</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=dcwarwick" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sydrosa"><img src="https://avatars.githubusercontent.com/u/47571589?v=4" width="100px;" alt=""/><br /><sub><b>Syd Rosa</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=sydrosa" title="Code">💻</a></td>
    <td align="center"><a href="http://davidmenendez.net"><img src="https://avatars1.githubusercontent.com/u/6370760?v=4" width="100px;" alt=""/><br /><sub><b>David Menendez</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=davidmenendez" title="Code">💻</a></td>
    <td align="center"><a href="http://www.matthewdgallo.com"><img src="https://avatars0.githubusercontent.com/u/10215203?v=4" width="100px;" alt=""/><br /><sub><b>Matthew Gallo</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=matthewgallo" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://simonfinney.dev"><img src="https://avatars2.githubusercontent.com/u/3846874?v=4" width="100px;" alt=""/><br /><sub><b>Simon Finney</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=SimonFinney" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/moores2"><img src="https://avatars2.githubusercontent.com/u/6977424?v=4" width="100px;" alt=""/><br /><sub><b>Simon Moore</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=moores2" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/polinaouk"><img src="https://avatars2.githubusercontent.com/u/24444328?v=4" width="100px;" alt=""/><br /><sub><b>Polina Olemskaia</b></sub></a><br /><a href="https://github.com/carbon-design-system/ibm-cloud-cognitive/commits?author=polinaouk" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Telemetry

In order to gather usage information for these components we use
[@carbon/telemetry](https://www.carbondesignsystem.com/help/faq/#telemetry).

## 📝 License

Licensed under the
[Apache-2.0 License](https://github.com/carbon-design-system/ibm-cloud-cognitive/blob/master/LICENSE).

[![This site is powered by Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
