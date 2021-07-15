/**
 * Copyright IBM Corp. 2021, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import {
  Button,
  InlineNotification,
  RadioButtonGroup,
  RadioButton,
  TextInput,
  Toggle,
  NumberInput,
} from 'carbon-components-react';
import cx from 'classnames';
import { pkg } from '../../../settings';
import { CreateTearsheet } from '../CreateTearsheet';
import { CreateTearsheetStep } from '../CreateTearsheetStep';
import { CreateTearsheetSection } from '../CreateTearsheetSection';

const blockClass = `${pkg.prefix}--tearsheet-create-multi-step`;

export const MultiStepWithSectionsTearsheet = () => {
  const [simulatedDelay] = useState(750);
  const [open, setOpen] = useState(false);
  const [shouldReject, setShouldReject] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [stepOneTextInputValue, setStepOneTextInputValue] = useState('');
  const [topicDescriptionValue, setTopicDescriptionValue] = useState('');
  const [topicVersionValue, setTopicVersionValue] = useState('');
  const [topicMetaData, setTopicMetaData] = useState('');
  const [partitionName, setPartitionName] = useState('');
  const [stepTwoTextInputValue, setStepTwoTextInputValue] = useState(1);
  const [stepThreeTextInputValue, setStepThreeTextInputValue] =
    useState('one-day');
  const [isInvalid, setIsInvalid] = useState(false);

  const clearCreateData = () => {
    setStepOneTextInputValue('');
    setTopicDescriptionValue('');
    setTopicVersionValue('');
    setStepTwoTextInputValue(1);
    setStepThreeTextInputValue('one-day');
    setHasSubmitError(false);
    setIsInvalid(false);
    setOpen(false);
  };

  return (
    <div>
      <style>{`.${blockClass} { opacity: 0 }`};</style>
      <Button onClick={() => setOpen(!open)}>
        {open ? 'Close CreateTearsheet' : 'Open CreateTearsheet'}
      </Button>
      <CreateTearsheet
        className={blockClass}
        submitButtonText="Create"
        cancelButtonText="Cancel"
        backButtonText="Back"
        nextButtonText="Next"
        description="Specify details for the new topic you want to create"
        label="This is the label of the multi step tearsheet"
        title="Create topic"
        open={open}
        onClose={clearCreateData}
        onRequestSubmit={() =>
          new Promise((resolve) => {
            setTimeout(() => {
              clearCreateData();
              resolve();
            }, simulatedDelay);
          })
        }
        sideNavAriaLabel="Create topic side nav"
        viewAllToggleLabelText="Show all available options"
        viewAllToggleOffLabelText="Off"
        viewAllToggleOnLabelText="On"
        includeViewAllToggle>
        <CreateTearsheetStep
          onNext={() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                // Example usage of how to prevent the next step if some kind
                // of error occured during the `onNext` handler.
                if (shouldReject) {
                  setHasSubmitError(true);
                  reject();
                }
                setIsInvalid(false);
                resolve();
              }, simulatedDelay);
            });
          }}
          title="Topic name"
          disableSubmit={!stepOneTextInputValue}>
          <CreateTearsheetSection
            title="General"
            id="create-tearsheet-section-general">
            <h6
              className={cx(
                `${blockClass}__description`,
                `${blockClass}__heading`
              )}>
              This is the unique name used to recognize your topic
            </h6>
            <p className={`${blockClass}__description`}>
              It will also be used by your producers and consumers as part of
              the connection information, so make it something easy to
              recognize.
            </p>
            <TextInput
              labelText="Topic name*"
              id="tearsheet-multi-step-story-text-input-multi-step-1"
              value={stepOneTextInputValue}
              placeholder="Enter topic name"
              onChange={(event) => {
                if (event.target.value.length) {
                  setIsInvalid(false);
                }
                setStepOneTextInputValue(event.target.value);
              }}
              invalid={isInvalid}
              invalidText="This is a required field"
              onBlur={() => {
                if (!stepOneTextInputValue.length) {
                  setIsInvalid(true);
                }
              }}
            />
            <TextInput
              labelText="Topic description"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-2"
              value={topicDescriptionValue}
              placeholder="Enter topic description"
              onChange={(event) => setTopicDescriptionValue(event.target.value)}
            />
            <TextInput
              labelText="Topic version"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
              value={topicVersionValue}
              placeholder="Enter topic version"
              onChange={(event) => setTopicVersionValue(event.target.value)}
            />
            {hasSubmitError && (
              <InlineNotification
                kind="error"
                title="Error"
                subtitle="Resolve errors to continue"
                onClose={() => setHasSubmitError(false)}
              />
            )}
            <Toggle
              className={`${blockClass}__error--toggle`}
              id="simulated-error-toggle"
              size="sm"
              labelText="Simulate error"
              onToggle={(event) => setShouldReject(event)}
            />
          </CreateTearsheetSection>
          <CreateTearsheetSection
            viewAllOnly
            title="Meta data"
            id="create-tearsheet-section-meta-data">
            <TextInput
              labelText="Topic meta data"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-4"
              value={topicMetaData}
              placeholder="Enter topic meta data"
              onChange={(event) => setTopicMetaData(event.target.value)}
            />
          </CreateTearsheetSection>
        </CreateTearsheetStep>
        <CreateTearsheetStep title="Empty" secondaryLabel="Optional">
          <CreateTearsheetSection
            title="Empty"
            id="create-tearsheet-section-empty">
            Empty step for demonstration purposes
          </CreateTearsheetSection>
        </CreateTearsheetStep>
        <CreateTearsheetStep title="Partitions" disableSubmit={!partitionName}>
          <CreateTearsheetSection
            title="Partitions"
            id="create-tearsheet-section-partitions">
            <h6
              className={cx(
                `${blockClass}__description`,
                `${blockClass}__heading`
              )}>
              One or more partitions make up a topic. A partition is an ordered
              list of messages.
            </h6>
            <p className={`${blockClass}__description`}>
              Partitions are distributed across the brokers in order to increase
              the scalability of your topic. You can also use them to distribute
              messages across the members of a consumer group.
            </p>
            <NumberInput
              id="carbon-number"
              min={1}
              max={100}
              value={stepTwoTextInputValue}
              label="Partitions"
              helperText="1 partition is sufficient for getting started but, production systems often have more."
              invalidText="Max partitions is 100, min is 1"
              onChange={(event) =>
                setStepTwoTextInputValue(event.imaginaryTarget.value)
              }
            />
            <TextInput
              labelText="Partition name*"
              id="tearsheet-multi-step-story-text-input-multi-step-3-input-1"
              value={partitionName}
              placeholder="Enter partition name"
              onChange={(event) => setPartitionName(event.target.value)}
            />
          </CreateTearsheetSection>
        </CreateTearsheetStep>
        <CreateTearsheetStep
          title="Message retention"
          disableSubmit={!stepThreeTextInputValue}
          onNext={() => Promise.resolve()}>
          <CreateTearsheetSection
            title="Messages"
            id="create-tearsheet-section-messages">
            <h6
              className={cx(
                `${blockClass}__description`,
                `${blockClass}__heading`
              )}>
              This is how long messages are retained before they are deleted.
            </h6>
            <p className={`${blockClass}__description`}>
              If your messages are not read by a consumer within this time, they
              will be missed.
            </p>
            <RadioButtonGroup
              legendText="Message retention"
              name="radio-button-group"
              defaultSelected={stepThreeTextInputValue}
              onChange={(value) => setStepThreeTextInputValue(value)}
              orientation="vertical">
              <RadioButton labelText="A day" value="one-day" id="one-day" />
              <RadioButton labelText="A week" value="one-week" id="one-week" />
              <RadioButton
                labelText="A month"
                value="one-month"
                id="one-month"
              />
              <RadioButton labelText="Custom" value="custom" id="custom" />
            </RadioButtonGroup>
          </CreateTearsheetSection>
        </CreateTearsheetStep>
      </CreateTearsheet>
    </div>
  );
};
