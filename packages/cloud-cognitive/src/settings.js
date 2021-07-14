import { Canary } from './components/_Canary';

import featureFlags from './generated/feature-flags/feature-flags';
import pkgSettings from './global/js/package-settings';
import { settings as carbonSettings } from 'carbon-components';
import React from 'react';
import { themes } from '@carbon/themes';

export const carbon = {
  get prefix() {
    return carbonSettings.prefix;
  },
  set prefix(val) {
    carbonSettings.prefix = val;
  },
  get flags() {
    return featureFlags;
  },
  get themes() {
    return themes;
  },
};

// Check that a component is enabled. This function returns a stub which checks
// the component status on first use and then renders as the component or as
// a Canary placeholder initialized with the name of the replaced component.
// Note that the returned stub carries any other properties which had already
// been assigned (eg propTypes, displayName, etc).
pkgSettings.checkComponentEnabled = (component, name) => {
  if (component.render) {
    // The component is a forward-ref, so make a stub forward-ref.
    const forward = React.forwardRef((props, ref) =>
      // Replace the stub's render fn so this test only happens once.
      (forward.render = pkgSettings.isComponentEnabled(name)
        ? // Replace the stub's render fn with the component's render fn.
          component.render
        : // Note that Canary is a direct render fn (not a forward-ref) and
          // will ignore the passed props and ref (if any)
          Canary.bind(undefined, { componentName: name }))(
        // Call it now (after this it will be directly called).
        props,
        ref
      )
    );

    // Transfer object properties already assigned (eg propTypes, displayName)
    // then merge in the stub forward-ref which checks the component status
    // when first used.
    return Object.assign({}, component, forward);
  } else {
    // The component is a direct render fn, so make a stub render fn.
    let render = (props) =>
      // Replace the stub render fn so this test only happens once.
      (render = pkgSettings.isComponentEnabled(name)
        ? // Replace the stub render fn with the component render fn.
          component
        : // Replace the stub render fn with the Canary render fn, which will
          // ignore the passed props.
          Canary.bind(undefined, { componentName: name }))(
        // Call it now (after this it will be directly called).
        props
      );

    // Transfer object properties already assigned (eg propTypes, displayName)
    // to a function which calls the stub render fn which checks the component
    // status when first used.
    return Object.assign((props) => render(props), component);
  }
};

export const pkg = pkgSettings;
