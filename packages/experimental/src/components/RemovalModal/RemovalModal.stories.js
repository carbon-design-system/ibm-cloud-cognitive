//
// Copyright IBM Corp. 2020, 2020
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useState } from 'react';
import { Button } from 'carbon-components-react';
import { RemovalModal } from '.';
import styles from './_storybook-styles.scss'; // import index in case more files are added later.
import mdx from './RemovalModal.mdx';

export default {
  title: 'Experimental/RemovalModal',
  component: RemovalModal,
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
  },
};

const resource = 'bx1001';

const defaultProps = {
  body: `Deleting ${resource} cannot be undone.`,
  className: 'remove-modal-test',
  header: 'Confirm delete',
  iconDescription: 'close',
  inputInvalidText: 'A valid value is required',
  inputLabelText: `Type ${resource} to confirm`,
  inputPlaceholderText: 'Name of resource',
  onRequestSubmit: () => console.log('submitted'),
  onRequestClose: () => console.log('cancel'),
  open: true,
  primaryButtonText: 'Delete',
  resource,
  secondaryButtonText: 'Close',
  subheader: `Delete ${resource}`,
};

const Template = (args) => {
  return <RemovalModal {...args} />;
};

const TemplateWIthState = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <RemovalModal
        {...args}
        open={open}
        onRequestClose={() => setOpen(false)}
      />
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
    </>
  );
};

export const WithStateManager = TemplateWIthState.bind({});
WithStateManager.args = {
  ...defaultProps,
  textConfirmation: true,
};

export const WithoutConfirmation = Template.bind({});
WithoutConfirmation.args = {
  ...defaultProps,
};

export const WithConfirmation = Template.bind({});
WithConfirmation.args = {
  ...defaultProps,
  textConfirmation: true,
};
