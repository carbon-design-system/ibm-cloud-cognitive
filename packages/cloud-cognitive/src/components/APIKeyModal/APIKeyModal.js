//
// Copyright IBM Corp. 2021, 2021
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  ComposedModal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  TextInput,
  InlineLoading,
  Form,
  Button,
} from 'carbon-components-react';
import {
  InformationFilled16,
  Copy16,
  ErrorFilled16,
} from '@carbon/icons-react';
import { APIKeyDownloader } from '../APIKeyDownloader';
import { pkg } from '../../settings';
import uuidv4 from '../../global/js/utils/uuidv4';
import { isRequiredIf } from '../../global/js/utils/props-helper';
const componentName = 'APIKeyModal';

export let APIKeyModal = forwardRef(
  (
    {
      apiKey,
      apiKeyLabel,
      apiKeyName,
      className,
      copyButtonText,
      copyIconDescription,
      createButtonText,
      createSuccessBody,
      createSuccessTitle,
      customSteps,
      createTitle,
      downloadBodyText,
      downloadFileName,
      downloadLinkText,
      editButtonText,
      editSuccess,
      editSuccessTitle,
      editing,
      error,
      errorMessage,
      hasDownloadLink,
      loading,
      loadingMessage,
      body,
      modalLabel,
      nameHelperText,
      nameLabel,
      namePlaceholder,
      nameRequired,
      nextStepButtonText,
      onClose,
      onRequestSubmit,
      open,
      previousStepButtonText,
      secondaryButtonText: closeButtonText,
      showPasswordLabel,
      visibilityToggle,
      ...rest
    },
    ref
  ) => {
    const [name, setName] = useState(apiKeyName);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPrimaryButtonDisabled, setIsPrimaryButtonDisabled] =
      useState(false);
    const [primaryButtonText, setPrimaryButtonText] = useState('');
    const [secondaryButtonText, setSecondaryButtonText] = useState('');
    const [title, setTitle] = useState('');
    const inputRef = useRef();
    const apiKeyInputId = useRef(uuidv4());
    const nameInputId = useRef(uuidv4());
    const hasSteps = Boolean(customSteps.length);
    const apiKeyLoaded = apiKey && !loading;
    const hasNextStep = hasSteps && currentStep < customSteps.length - 1;
    const hasPreviousStep = hasSteps && currentStep !== 0;
    const copyButtonProps = {
      renderIcon: Copy16,
      iconDescription: copyIconDescription,
    };
    const blockClass = `${pkg.prefix}--apikey-modal`;

    useEffect(() => {
      if (inputRef.current && open) {
        inputRef.current.focus();
      }
    }, [open]);

    useEffect(() => {
      if (loading) {
        setIsPrimaryButtonDisabled(true);
      } else if (hasSteps && 'valid' in customSteps[currentStep]) {
        setIsPrimaryButtonDisabled(!customSteps[currentStep].valid);
      } else if (!hasSteps && nameRequired && !name) {
        setIsPrimaryButtonDisabled(true);
      } else {
        setIsPrimaryButtonDisabled(false);
      }
    }, [loading, hasSteps, customSteps, currentStep, nameRequired, name]);

    useEffect(() => {
      if (editing && !hasNextStep) {
        setPrimaryButtonText(editButtonText);
      } else if (apiKey) {
        setPrimaryButtonText(copyButtonText);
      } else if (hasNextStep) {
        setPrimaryButtonText(nextStepButtonText);
      } else {
        setPrimaryButtonText(createButtonText);
      }
    }, [
      apiKey,
      editing,
      editButtonText,
      copyButtonText,
      hasNextStep,
      nextStepButtonText,
      createButtonText,
    ]);

    useEffect(() => {
      if (hasPreviousStep && !apiKeyLoaded) {
        setSecondaryButtonText(previousStepButtonText);
      } else {
        setSecondaryButtonText(closeButtonText);
      }
    }, [
      hasPreviousStep,
      apiKeyLoaded,
      previousStepButtonText,
      closeButtonText,
    ]);

    useEffect(() => {
      if (editing && editSuccess) {
        setTitle(editSuccessTitle);
      } else if (apiKeyLoaded) {
        setTitle(createSuccessTitle);
      } else if (hasSteps) {
        setTitle(customSteps[currentStep].title);
      } else {
        setTitle(createTitle);
      }
    }, [
      editing,
      editSuccess,
      editSuccessTitle,
      apiKeyLoaded,
      createSuccessTitle,
      hasSteps,
      customSteps,
      currentStep,
      createTitle,
    ]);

    const setNameHandler = (evt) => {
      setName(evt.target.value);
    };

    const onCloseHandler = () => {
      setName('');
      setCurrentStep(0);
      onClose();
    };

    const submitHandler = (evt) => {
      if (hasNextStep) {
        setCurrentStep(currentStep + 1);
      } else if (apiKeyLoaded) {
        navigator.clipboard.writeText(apiKey);
      } else {
        evt.preventDefault();
        onRequestSubmit(name);
      }
    };

    const onBackHandler = () => {
      if (hasPreviousStep && !apiKeyLoaded) {
        setCurrentStep(currentStep - 1);
      } else {
        onCloseHandler();
      }
    };

    return (
      <ComposedModal
        {...rest}
        {...{ open, ref }}
        className={cx(className, blockClass)}
        onClose={onCloseHandler}
        size="sm"
        preventCloseOnClickOutside>
        <ModalHeader
          className={`${blockClass}__header`}
          title={title}
          label={hasPreviousStep ? modalLabel : ''}
        />
        <ModalBody className={`${blockClass}__body-container`}>
          {hasSteps && !apiKeyLoaded ? (
            customSteps[currentStep].content
          ) : (
            <>
              {body && <p className={`${blockClass}__body`}>{body}</p>}
              {apiKey && visibilityToggle && (
                <TextInput.PasswordInput
                  value={apiKey}
                  labelText={apiKeyLabel}
                  id={apiKeyInputId.current}
                  showPasswordLabel={showPasswordLabel}
                  tooltipPosition="left"
                />
              )}
              {apiKey && !visibilityToggle && (
                <TextInput
                  value={apiKey}
                  labelText={apiKeyLabel}
                  id={apiKeyInputId.current}
                />
              )}
              {(editing || (!apiKeyLoaded && nameRequired)) && (
                <Form onSubmit={submitHandler}>
                  <TextInput
                    helperText={nameHelperText}
                    placeholder={namePlaceholder}
                    labelText={nameLabel}
                    onChange={setNameHandler}
                    value={name}
                    id={nameInputId.current}
                    disabled={loading}
                    ref={inputRef}
                  />
                </Form>
              )}
              {loading && (
                <InlineLoading
                  description={loadingMessage}
                  className={`${blockClass}__loader`}
                />
              )}
              {error && (
                <div className={`${blockClass}__messaging`}>
                  <div className={`${blockClass}__error-icon`}>
                    <ErrorFilled16 />
                  </div>
                  <p className={`${blockClass}__messaging-text`}>
                    {errorMessage}
                  </p>
                </div>
              )}
              {apiKeyLoaded && (
                <div className={`${blockClass}__messaging`}>
                  <InformationFilled16 />
                  {hasDownloadLink ? (
                    <APIKeyDownloader
                      apiKey={apiKey}
                      bodyText={downloadBodyText}
                      fileName={downloadFileName}
                      linkText={downloadLinkText}
                    />
                  ) : (
                    <div className={`${blockClass}__messaging-text`}>
                      {createSuccessBody}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter className={`${blockClass}__footer`}>
          <Button type="button" kind="secondary" onClick={onBackHandler}>
            {secondaryButtonText}
          </Button>
          <Button
            {...(apiKeyLoaded ? copyButtonProps : {})}
            type="submit"
            kind="primary"
            onClick={submitHandler}
            disabled={isPrimaryButtonDisabled}>
            {primaryButtonText}
          </Button>
        </ModalFooter>
      </ComposedModal>
    );
  }
);

const customStepsRequiredProps = isRequiredIf(
  PropTypes.string,
  ({ customSteps }) => customSteps.length > 1
);

// Return a placeholder if not released and not enabled by feature flag
APIKeyModal = pkg.checkComponentEnabled(APIKeyModal, componentName);

APIKeyModal.propTypes = {
  apiKey: PropTypes.string,
  apiKeyLabel: PropTypes.string,
  apiKeyName: PropTypes.string,
  body: PropTypes.string,
  className: PropTypes.string,
  copyButtonText: PropTypes.string,
  copyIconDescription: PropTypes.string,
  createButtonText: PropTypes.string,
  createSuccessBody: PropTypes.node,
  createSuccessTitle: PropTypes.string,
  createTitle: PropTypes.string,
  customSteps: PropTypes.arrayOf(
    PropTypes.shape({
      valid: PropTypes.bool,
      content: PropTypes.node,
      title: PropTypes.string,
    })
  ),
  downloadBodyText: PropTypes.string,
  downloadFileName: PropTypes.string,
  downloadLinkText: PropTypes.string,
  editButtonText: PropTypes.string,
  editSuccess: PropTypes.bool,
  editSuccessTitle: PropTypes.string,
  editing: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  hasDownloadLink: PropTypes.bool,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  modalLabel: PropTypes.string,
  nameHelperText: PropTypes.string,
  nameLabel: PropTypes.string,
  namePlaceholder: PropTypes.string,
  nameRequired: PropTypes.bool,
  nextStepButtonText: customStepsRequiredProps,
  onClose: PropTypes.func,
  onRequestSubmit: PropTypes.func,
  open: PropTypes.bool,
  previousStepButtonText: customStepsRequiredProps,
  secondaryButtonText: PropTypes.string,
  showPasswordLabel: PropTypes.string,
  visibilityToggle: PropTypes.bool,
};

APIKeyModal.defaultProps = {
  visibilityToggle: false,
  customSteps: [],
  hasDownloadLink: false,
  loading: false,
  nameRequired: false,
  open: false,
};

APIKeyModal.displayName = componentName;
