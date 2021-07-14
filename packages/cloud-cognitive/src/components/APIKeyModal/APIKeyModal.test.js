//
// Copyright IBM Corp. 2021, 2021
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { APIKeyModal } from '.';

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const { name } = APIKeyModal;
const defaultProps = {
  apiKey: '123-456-789',
  apiKeyLabel: 'api key label',
  apiKeyName: '',
  className: 'class-test',
  copyButtonText: 'copy',
  copyIconDescription: 'copy',
  createButtonText: 'create button',
  createSuccessBody: 'created successfully body',
  createSuccessTitle: 'created successfully title',
  customSteps: [],
  createTitle: 'created title',
  downloadBodyText: 'download body',
  downloadFileName: 'filename',
  downloadLinkText: 'download link text',
  editButtonText: 'edit button',
  editSuccess: false,
  editSuccessTitle: 'edited successfully',
  editing: false,
  error: false,
  errorMessage: 'an error occured',
  hasDownloadLink: true,
  loading: false,
  loadingMessage: 'loading',
  body: 'modal body',
  modalLabel: 'modal label',
  nameHelperText: 'name helper',
  nameLabel: 'name label',
  namePlaceholder: 'name placeholder',
  nameRequired: true,
  nextStepButtonText: 'next step',
  onClose: () => {},
  onRequestSubmit: () => {},
  open: true,
  previousStepButtonText: 'previous step',
  secondaryButtonText: 'close',
  showPasswordLabel: 'show password label',
  visibilityToggle: true,
};

URL.createObjectURL = jest.fn(() => Promise.resolve('download-link'));

describe(name, () => {
  it('renders with minimal setup', () => {
    const props = {
      ...defaultProps,
      nameRequired: false,
      hasDownloadLink: false,
    };
    const { click } = fireEvent;
    const { container } = render(<APIKeyModal {...props} />);
    const copyBtn = container.querySelector('.bx--btn--primary');
    click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      defaultProps.apiKey
    );
  });

  it('renders with standard setup', async () => {
    const { click, change } = fireEvent;
    const { fn } = jest;
    const onRequestSubmit = fn();
    const props = {
      ...defaultProps,
      apiKey: '',
      onRequestSubmit,
    };

    const { getByText, container, rerender } = render(
      <APIKeyModal {...props} />
    );

    const nameInput = container.querySelector('.bx--text-input');
    const createButton = getByText(props.createButtonText);

    change(nameInput, { target: { value: 'testkey' } });
    click(createButton);
    expect(onRequestSubmit).toHaveBeenCalled();

    rerender(<APIKeyModal {...props} loading />);
    expect(getByText(props.loadingMessage)).toBeVisible();
    rerender(<APIKeyModal {...props} apiKey="444-444-444-444" />);
    await waitFor(() => getByText(props.downloadLinkText));
    const copyBtn = getByText(props.copyButtonText);
    click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '444-444-444-444'
    );
  });

  it('displays an error message when a create error occurs', async () => {
    const { click, change } = fireEvent;
    const { fn } = jest;
    const onRequestSubmit = fn();
    const props = {
      ...defaultProps,
      onRequestSubmit,
      errorMessage: 'an error occured',
      apiKey: '',
    };

    const { getByText, container, rerender } = render(
      <APIKeyModal {...props} />
    );

    const nameInput = container.querySelector('.bx--text-input');
    const createButton = getByText(props.createButtonText);

    change(nameInput, { target: { value: 'testkey' } });
    click(createButton);
    expect(onRequestSubmit).toHaveBeenCalled();

    rerender(<APIKeyModal {...props} error />);
    expect(getByText(props.errorMessage)).toBeVisible();
  });

  it('should be able to properly navigate a series of custom steps', async () => {
    const { click } = fireEvent;
    const { fn } = jest;
    const onRequestSubmit = fn();
    const onClose = fn();
    const customSteps = [
      {
        valid: true,
        content: <input type="text" value="a" placeholder="input a" readOnly />,
        title: 'step 1',
      },
      {
        valid: true,
        content: <input type="text" value="b" placeholder="input b" readOnly />,
        title: 'step 2',
      },
      {
        valid: false,
        content: <input type="text" value="c" placeholder="input c" readOnly />,
        title: 'step 3',
      },
    ];
    const props = {
      ...defaultProps,
      onRequestSubmit,
      onClose,
      customSteps,
      hasDownloadLink: false,
      apiKey: '',
    };

    const { rerender, getByPlaceholderText, getByText } = render(
      <APIKeyModal {...props} />
    );

    // step 1
    expect(getByPlaceholderText('input a')).toBeVisible();
    expect(getByText(props.nextStepButtonText)).toBeVisible();
    expect(getByText(props.secondaryButtonText)).toBeVisible();

    // advance to step 2
    click(getByText(props.nextStepButtonText));
    expect(getByPlaceholderText('input b')).toBeVisible();
    expect(getByText(props.nextStepButtonText)).toBeVisible();
    expect(getByText(props.previousStepButtonText)).toBeVisible();

    // go back to step 1
    click(getByText(props.previousStepButtonText));
    expect(getByPlaceholderText('input a')).toBeVisible();
    expect(getByText(props.nextStepButtonText)).toBeVisible();
    expect(getByText(props.secondaryButtonText)).toBeVisible();

    // advance to step 2
    click(getByText(props.nextStepButtonText));
    expect(getByPlaceholderText('input b')).toBeVisible();
    expect(getByText(props.nextStepButtonText)).toBeVisible();
    expect(getByText(props.previousStepButtonText)).toBeVisible();

    // advance to step 3
    click(getByText(props.nextStepButtonText));
    expect(getByPlaceholderText('input c')).toBeVisible();
    expect(getByText(props.createButtonText)).toBeVisible();
    expect(getByText(props.previousStepButtonText)).toBeVisible();

    // submit invalid form
    click(getByText(props.createButtonText));
    expect(onRequestSubmit).not.toHaveBeenCalled();

    // submit valid form
    customSteps[2].valid = true;
    rerender(<APIKeyModal {...props} customSteps={customSteps} />);
    /**
     * the logic behind setting the create button to disabled is set in
     * a useEffect (setIsPrimaryButtonDisabled). rerender doesn't trigger
     * useEffect though, so to cause the useEffect to trigger i'm going
     * to the previous step and back before trying to click the button
     */
    click(getByText(props.previousStepButtonText));
    click(getByText(props.nextStepButtonText));
    click(getByText(props.createButtonText));
    expect(onRequestSubmit).toHaveBeenCalled();
    rerender(<APIKeyModal {...props} />);
    rerender(<APIKeyModal {...props} apiKey="abc-123" />);
    expect(getByText(props.createSuccessBody)).toBeVisible();
    click(getByText(props.secondaryButtonText));
    expect(onClose).toHaveBeenCalled();
  });
});
