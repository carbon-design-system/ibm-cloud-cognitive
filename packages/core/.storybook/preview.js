/**
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withInfo } from '@storybook/addon-info';
import React, { useEffect } from 'react';
import { withCarbonTheme } from '@carbon/storybook-addon-theme/react';

import index from './index.scss';

// Only impacts on experimental stories
import { getPackageFlags } from '../../experimental/src/global/js/settings';
getPackageFlags({ component: { enableAll: false } }); // {ExampleComponent: true}});

const Style = ({ children, styles }) => {
  const { unuse, use } = styles;

  useEffect(() => {
    use();

    return () => unuse();
  }, []);

  return children;
};

const decorators = [
  withInfo,
  (storyFn, { parameters: { styles } }) => {
    const story = storyFn();

    return (
      <div className="preview-position-fix">
        <Style styles={index}>
          {styles ? <Style styles={styles}>{story}</Style> : story}
        </Style>
      </div>
    );
  },
  withCarbonTheme,
];

const parameters = {
  controls: { expanded: true, hideNoControlsWarning: true },
  layout: 'centered',

  // Optional default Carbon theme.
  carbonTheme: {
    theme: 'g10',
  },
};

export { decorators, parameters };
