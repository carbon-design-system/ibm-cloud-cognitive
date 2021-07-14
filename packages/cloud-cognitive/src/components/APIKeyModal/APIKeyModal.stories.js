//
// Copyright IBM Corp. 2021, 2021
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  TextInput,
  RadioButton,
  RadioButtonGroup,
  FormGroup,
  Toggle,
  InlineLoading,
  Form,
} from 'carbon-components-react';
import { action } from '@storybook/addon-actions';
import { pkg } from '../../settings';
import { getStorybookPrefix } from '../../../config';
import { APIKeyModal } from '.';
import mdx from './APIKeyModal.mdx';
const storybookPrefix = getStorybookPrefix(pkg, APIKeyModal.displayName);
import wait from '../../global/js/utils/wait';
import styles from './_storybook-styles.scss'; // import index in case more files are added later.

export default {
  title: `${storybookPrefix}/${APIKeyModal.displayName}`,
  component: APIKeyModal,
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
  },
};

const defaultProps = {
  apiKey: '123-456-789',
  apiKeyLabel: 'API key',
  copyButtonText: 'Copy',
  copyIconDescription: 'Copy',
  visibilityToggle: true,
  downloadBodyText:
    'This is your unique API key and is non-recoverable. If you lose this API key, you will have to reset it.',
  downloadLinkText: 'Download as JSON',
  hasDownloadLink: true,
  downloadFileName: 'apikey',
  open: true,
  secondaryButtonText: 'Close',
  createSuccessBody: (
    <p>
      This is your unique API key and is non-recoverable. If you lose this API
      key, you will have to reset it.
    </p>
  ),
  createSuccessTitle: 'API key successully created',
  editSuccessTitle: 'API key successully saved',
  loadingMessage: 'Generating...',
};

const blockClass = `${pkg.prefix}--apikey-modal`;

const InstantTemplate = (args) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    setLoading(true);
    await wait(1000);
    setOpen(true);
    setLoading(false);
  };

  return (
    <>
      <APIKeyModal {...args} onClose={() => setOpen(false)} open={open} />
      {loading ? (
        <Button
          renderIcon={InlineLoading}
          className={`${blockClass}__button-loading`}>
          Generating...
        </Button>
      ) : (
        <Button onClick={generateKey}>Generate</Button>
      )}
    </>
  );
};

const TemplateWithState = (args) => {
  const { error } = args;
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // eslint-disable-next-line
  const submitHandler = async (apiKeyName) => {
    action(`submitted ${apiKeyName}`)();
    setFetchError(false);
    setLoading(true);
    await wait(1000);
    if (error) {
      setFetchError(true);
    } else {
      setApiKey('111-111-111-111');
    }
    setLoading(false);
  };

  const onCloseHandler = () => {
    setOpen(false);
    setApiKey('');
  };

  return (
    <>
      <APIKeyModal
        {...args}
        apiKey={apiKey}
        loading={loading}
        onClose={onCloseHandler}
        onRequestSubmit={submitHandler}
        open={open}
        error={fetchError}
      />
      <Button onClick={() => setOpen(!open)}>Generate API key</Button>
    </>
  );
};

const MultiStepTemplate = (args) => {
  const {
    editing,
    savedName,
    savedPermissions,
    savedAllResources,
    savedResource,
  } = args;
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus();
    }
  }, [open]);

  // multi step options
  const [name, setName] = useState(savedName);
  const [permissions, setPermissions] = useState(savedPermissions);
  const [allResources, setAllResources] = useState(savedAllResources);
  const [resource, setResource] = useState(savedResource);
  const [editSuccess, setEditSuccess] = useState(false);

  // eslint-disable-next-line
  const submitHandler = async () => {
    action('submitted')();
    setLoading(true);
    await wait(1000);
    if (editing) {
      setEditSuccess(true);
    } else {
      setApiKey('111-111-111-111');
    }
    setLoading(false);
  };

  const onCloseHandler = () => {
    setOpen(false);
    if (!editing) {
      setApiKey('');
      setName('');
      setPermissions('');
      setAllResources(false);
      setResource('');
    }
  };

  const formHandler = (evt) => {
    evt.preventDefault();
    submitHandler();
  };

  const allResourcesHandler = (e) => {
    const { checked } = e.target;
    if (checked && resource) {
      setResource('');
    }
    setAllResources(checked);
  };

  const steps = [
    {
      valid: Boolean(name && permissions),
      title: editing ? 'Edit API key' : 'Generate API key',
      content: (
        <>
          <p className={`${blockClass}__body`}>
            (Optional description text) To connect securely to [product name],
            your application or tool needs an API key with permission to access
            resources such as [product resource name].
          </p>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            labelText="Name your application"
            placeholder="Application name"
            ref={inputRef}
          />
          <FormGroup
            legendText="What do you want your application to be able to do"
            className={`${blockClass}__permissions`}>
            <RadioButtonGroup
              onChange={(opt) => setPermissions(opt)}
              valueSelected={permissions}
              name="permission"
              orientation="vertical">
              <RadioButton value="Read and write" labelText="Read and write" />
              <RadioButton value="Read only" labelText="Read only" />
              <RadioButton value="Write only" labelText="Write only" />
            </RadioButtonGroup>
          </FormGroup>
        </>
      ),
    },
    {
      valid: allResources || (!allResources && !!resource),
      title: 'Choose which resources the API will have access to',
      content: (
        <>
          <Form onSubmit={formHandler}>
            <FormGroup className={`${blockClass}__resource-toggle`}>
              <Toggle
                onChange={allResourcesHandler}
                labelText="All resources"
                labelA="Off"
                labelB="On"
                toggled={allResources}
                disabled={loading}
                id="toggle1"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </FormGroup>
            <FormGroup className={`${blockClass}__resource-name`}>
              <TextInput
                value={resource}
                onChange={(e) => setResource(e.target.value)}
                labelText="Which resource?"
                placeholder="Resources name"
                disabled={loading || allResources}
              />
            </FormGroup>
          </Form>
          {loading && (
            <InlineLoading
              description={loading ? 'Saving...' : 'Generating...'}
            />
          )}
          {editSuccess && (
            <div className={`${blockClass}__messaging`}>
              Edited successfully
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <APIKeyModal
        {...args}
        apiKey={apiKey}
        loading={loading}
        onClose={onCloseHandler}
        onRequestSubmit={submitHandler}
        open={open}
        customSteps={steps}
        nameRequired={false}
      />
      <Button onClick={() => setOpen(!open)}>
        {editing ? 'Edit API key' : 'Generate API key'}
      </Button>
    </>
  );
};

const EditTemplate = (args) => {
  const { error, apiKeyName } = args;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const submitHandler = async () => {
    action(`submitted ${apiKeyName}`)();
    setFetchError(false);
    setLoading(true);
    await wait(1000);
    if (error) {
      setFetchError(true);
    } else {
      setFetchSuccess(true);
    }
    setLoading(false);
  };

  const onCloseHandler = () => {
    setOpen(false);
  };

  const onOpenHandler = () => {
    setOpen(true);
  };

  return (
    <>
      <APIKeyModal
        {...args}
        loading={loading}
        onClose={onCloseHandler}
        onRequestSubmit={submitHandler}
        open={open}
        error={fetchError}
        editSuccess={fetchSuccess}
      />
      <Button onClick={onOpenHandler}>Edit API key</Button>
    </>
  );
};

export const Create = TemplateWithState.bind({});
Create.args = {
  ...defaultProps,
  createButtonText: 'Generate API key',
  createTitle: 'Generate an API key',
  body: '(Optional description text) To connect securely to [product name], your application or tool needs an API key with permission to access resources such as [product resource name].',
  nameHelperText:
    'Providing the application name will help you idenfity your API key later.',
  nameLabel: 'Name your application',
  namePlaceholder: 'Application name',
  nameRequired: true,
  showPasswordLabel: 'Show password',
};

export const CreateWithError = TemplateWithState.bind({});
CreateWithError.args = {
  ...defaultProps,
  visibilityToggle: true,
  createButtonText: 'Generate API key',
  createTitle: 'Generate an API key',
  body: '(Optional description text) To connect securely to [product name], your application or tool needs an API key with permission to access resources such as [product resource name].',
  nameHelperText:
    'Providing the application name will help you idenfity your API key later.',
  nameLabel: 'Name your application',
  namePlaceholder: 'Application name',
  nameRequired: true,
  error: true,
  errorMessage: 'Failed to create API key',
};

export const InstantCreate = InstantTemplate.bind({});
InstantCreate.args = {
  ...defaultProps,
  apiKeyLabel: '',
  showPasswordLabel: 'Show password',
};

export const CustomCreate = MultiStepTemplate.bind({});
CustomCreate.args = {
  ...defaultProps,
  createButtonText: 'Generate',
  modalLabel: 'Genreate API key',
  nextStepButtonText: 'Next',
  previousStepButtonText: 'Previous',
  downloadFileName: 'apikey',
  showPasswordLabel: 'Show password',
  buttonText: 'Generate API key',
  savedName: '',
  savedAllResources: false,
  savedResource: '',
  savedPermissions: '',
};

export const Edit = EditTemplate.bind({});
Edit.args = {
  ...defaultProps,
  editButtonText: 'Save API key',
  createTitle: 'Save an API key',
  body: '(Optional description text) To connect securely to [product name], your application or tool needs an API key with permission to access resources such as [product resource name].',
  nameHelperText:
    'Providing the application name will help you idenfity your API key later.',
  nameLabel: 'Name your application',
  namePlaceholder: 'Application name',
  nameRequired: true,
  showPasswordLabel: 'Show password',
  editing: true,
  apiKey: '',
  loadingMessage: 'Saving...',
  apiKeyName: 'test_key_1',
};

export const EditWithError = EditTemplate.bind({});
EditWithError.args = {
  ...defaultProps,
  editButtonText: 'Save API key',
  createTitle: 'Save an API key',
  body: '(Optional description text) To connect securely to [product name], your application or tool needs an API key with permission to access resources such as [product resource name].',
  nameHelperText:
    'Providing the application name will help you idenfity your API key later.',
  nameLabel: 'Name your application',
  namePlaceholder: 'Application name',
  nameRequired: true,
  showPasswordLabel: 'Show password',
  editing: true,
  apiKey: '',
  loadingMessage: 'Saving...',
  createSuccessBody: 'API Key saved.',
  apiKeyName: 'test_key_1',
  error: true,
  errorMessage: 'Failed to edit API key',
};

export const CustomEdit = MultiStepTemplate.bind({});
CustomEdit.args = {
  ...defaultProps,
  createButtonText: 'Generate',
  modalLabel: 'Genreate API key',
  nextStepButtonText: 'Next',
  previousStepButtonText: 'Previous',
  downloadFileName: 'apikey',
  showPasswordLabel: 'Show password',
  buttonText: 'Generate API key',
  savedName: 'test_key_1',
  savedAllResources: false,
  savedResource: 'resource_1',
  savedPermissions: 'Read only',
  editing: true,
  editButtonText: 'Save API key',
};
