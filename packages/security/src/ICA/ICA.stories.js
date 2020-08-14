/**
 * Copyright IBM Corp. 2020, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { sectionTitle } from '../../config';
import { ICA } from '..';
import styles from './_index.scss';

export const Default = (props) => <ICA {...props} />;

const {
  defaultProps: { total, ...defaultProps },
} = ICA;

export default {
  title: `${sectionTitle}/ICA`,
  component: ICA,
  parameters: { styles },
  args: {
    ...defaultProps,
    label: 'Label',
    value: total,
  },
};
