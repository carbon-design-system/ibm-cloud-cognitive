/**
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import { pkg } from '../../settings';
import '../../utils/enable-all'; // must come before component is imported (directly or indirectly)

import {
  Button,
  ButtonSet,
  Dropdown,
  Form,
  FormGroup,
  Tab,
  Tabs,
  TextInput,
} from 'carbon-components-react';

import { Tearsheet, TearsheetNarrow } from '.';
import {
  actionsOptions,
  actionsLabels,
  actionsMapping,
} from '../ActionSet/actions.js';

import { getStorybookPrefix } from '../../../config';
const storybookPrefix = getStorybookPrefix(pkg, Tearsheet.displayName);

import styles from './_storybook-styles.scss';

import mdx from './Tearsheet.mdx';

export default {
  title: `${storybookPrefix}/Tearsheets/${Tearsheet.displayName}`,
  component: Tearsheet,
  subcomponents: { TearsheetNarrow },
  parameters: { styles, docs: { page: mdx } },
  argTypes: {
    actions: {
      control: { type: 'select', labels: actionsLabels },
      options: actionsOptions,
      mapping: actionsMapping(
        {
          primary: 'Replace',
          secondary: 'Back',
          secondary2: 'Keep Both',
          ghost: 'Cancel',
        },
        action
      ),
    },
    description: { control: { type: 'text' } },
    headerActions: {
      control: {
        type: 'select',
        labels: {
          0: 'none',
          1: 'drop-down',
          2: 'buttons',
        },
      },
      options: [0, 1, 2],
      mapping: {
        0: null,
        1: (
          <Dropdown
            label="Choose an option"
            items={['option 1', 'option 2', 'option 3', 'option 4']}
          />
        ),
        2: (
          <ButtonSet>
            <Button kind="secondary" size="sm" style={{ width: 'initial' }}>
              Secondary
            </Button>
            <Button kind="primary" size="sm" style={{ width: 'initial' }}>
              Primary
            </Button>
          </ButtonSet>
        ),
      },
    },
    label: { control: { type: 'text' } },
    title: { control: { type: 'text' } },
    influencer: { control: { disable: true } },
    onClose: { control: { disable: true } },
    navigation: { control: { disable: true } },
    open: { control: { disable: true } },
  },
};

// Test values for props.

const closeIconDescription = 'Close the tearsheet';

const description =
  'This is a description for the tearsheet, providing an opportunity to \
  describe the flow.';

const influencer = (
  <div className="tearsheet-stories__dummy-content-block">Influencer</div>
);

const label = 'The label of the tearsheet';

const mainContent = (
  <div className="tearsheet-stories__dummy-content-block">
    <Form>
      <p>Main content</p>
      <FormGroup>
        <TextInput labelText="Enter an important value here" />
        <TextInput light labelText="Here is a light entry field:" />
      </FormGroup>
    </Form>
  </div>
);

const tabs = (
  <div className="tearsheet-stories__tabs">
    <Tabs onSelectionChange={action('Tab selection changed')}>
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
      <Tab label="Tab 3" />
      <Tab label="Tab 4" />
    </Tabs>
  </div>
);

const title = 'Title of the tearsheet';

// Template.
// eslint-disable-next-line react/prop-types
const Template = ({ actions, ...args }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`.${pkg.prefix}--tearsheet { opacity: 0 }`};</style>
      <Button onClick={() => setOpen(true)}>Open Tearsheet</Button>
      <Tearsheet
        {...args}
        {...{ actions, open }}
        onClose={() => setOpen(false)}>
        {mainContent}
      </Tearsheet>
    </>
  );
};

// Stories
export const tearsheet = Template.bind({});
tearsheet.storyName = 'Tearsheet';
tearsheet.args = {
  description,
  onClose: action('onClose called'),
  title,
  actions: 6,
};

export const withAllHeaderItems = Template.bind({});
withAllHeaderItems.storyName = 'Tearsheet with navigation';
withAllHeaderItems.args = {
  closeIconDescription,
  description,
  label,
  navigation: tabs,
  onClose: action('onClose called'),
  title,
  actions: 6,
};

export const withInfluencer = Template.bind({});
withInfluencer.storyName = 'Tearsheet with influencer';
withInfluencer.args = {
  description,
  influencer,
  influencerPosition: 'left',
  influencerWidth: 'narrow',
  onClose: action('onClose called'),
  title,
  verticalPosition: 'normal',
  actions: 6,
};

export const fullyLoaded = Template.bind({});
fullyLoaded.storyName = 'Tearsheet with all header items and influencer';
fullyLoaded.args = {
  closeIconDescription,
  description,
  hasCloseIcon: true,
  headerActions: 2,
  influencer,
  influencerPosition: 'left',
  influencerWidth: 'narrow',
  label,
  navigation: tabs,
  onClose: action('onClose called'),
  title,
  verticalPosition: 'normal',
  actions: 0,
};
