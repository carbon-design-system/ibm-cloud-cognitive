//
// Copyright IBM Corp. 2020, 2021
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

// Import portions of React that are needed.
import React, { useEffect, useState, useRef } from 'react';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';
import { pkg } from '../../settings';
import { useResizeDetector } from 'react-resize-detector';

// Carbon and package components we use.
import { Button } from 'carbon-components-react';
import uuidv4 from '../../global/js/utils/uuidv4';
import {
  deprecateProp,
  extractShapesArray,
  prepareProps,
} from '../../global/js/utils/props-helper';
import { ActionBarItem } from './ActionBarItem';
import { ActionBarOverflowItems } from './ActionBarOverflowItems';

// The block part of our conventional BEM class names (blockClass__E--M).
const blockClass = `${pkg.prefix}--action-bar`;
const componentName = 'ActionBar';

// NOTE: the component SCSS is not imported here: it is rolled up separately.

/**
 * The ActionBar is used internally by the PageHeader to wrap ActionBarItems.
 */
export let ActionBar = React.forwardRef(
  (
    {
      actions,
      children,
      className,
      maxVisible,
      onWidthChange,
      overflowAriaLabel,
      rightAlign,
      // Collect any other property values passed in.
      ...rest
    },
    ref
  ) => {
    const [displayCount, setDisplayCount] = useState(0);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [hiddenSizingItems, setHiddenSizingItems] = useState([]);
    const internalId = useRef(uuidv4());
    const [itemArray, setItemArray] = useState([]);
    const refDisplayedItems = useRef(null);
    const sizingRef = useRef(null);

    // create child array from children which may be a fragment and create hidden sizing items
    useEffect(() => {
      // NOTE: setting item Array inside useEffect prevents looping renders as a result of setting hiddenSizingItems
      let newItemArray;
      if (actions) {
        newItemArray = actions;
      } else {
        newItemArray = extractShapesArray(children);
      }
      setItemArray(newItemArray);

      // Hidden action bar and items used to calculate sizes
      setHiddenSizingItems(
        <div
          className={`${blockClass}__hidden-sizing-items`}
          aria-hidden={true}
          ref={sizingRef}>
          <ActionBarOverflowItems
            className={`${blockClass}__hidden-sizing-item`}
            overflowAriaLabel="hidden sizing overflow items"
            overflowItems={[]}
            key="hidden-overflow-menu"></ActionBarOverflowItems>
          {newItemArray.map(({ key, ...rest }) => (
            <ActionBarItem
              {...rest}
              key={`hidden-item-${key}`}
              className={`${blockClass}__hidden-sizing-item`}
            />
          ))}
        </div>
      );
    }, [actions, children]);

    // creates displayed items based on itemArray, displayCount and alignment
    useEffect(() => {
      // Calculate the displayed items
      const newDisplayedItems = itemArray.map(({ key, ...rest }) => (
        <ActionBarItem {...rest} key={key} />
      ));

      // extract any there is not enough room for into newOverflowItems
      const newOverflowItems = newDisplayedItems.splice(displayCount);

      // add overflow menu if needed
      if (newOverflowItems.length) {
        newDisplayedItems.push(
          <ActionBarOverflowItems
            overflowAriaLabel={overflowAriaLabel}
            overflowItems={newOverflowItems}
            key={`overflow-menu-${internalId.current}`}></ActionBarOverflowItems>
        );
      }

      setDisplayedItems(newDisplayedItems);
    }, [itemArray, displayCount, overflowAriaLabel]);

    // determine display count based on space available and width of pageActions
    const checkFullyVisibleItems = () => {
      /* istanbul ignore next if */
      if (sizingRef.current) {
        let sizingItems = Array.from(
          sizingRef.current.querySelectorAll(
            `.${blockClass}__hidden-sizing-item`
          )
        );

        // first item is always the overflow even if nothing else is rendered
        const overflowItem = sizingItems.shift();

        // determine how many will fit
        let spaceAvailable = refDisplayedItems.current.offsetWidth;
        let willFit = 0;
        let maxVisibleWidth = 0;
        let fitLimit = maxVisible
          ? Math.min(maxVisible, sizingItems.length)
          : sizingItems.length;

        // loop checking the space available
        for (let i = 0; i < fitLimit; i++) {
          const newSpaceAvailable = spaceAvailable - sizingItems[i].offsetWidth;

          // update maxVisibleWidth for later use by onWidthChange
          maxVisibleWidth += sizingItems[i].offsetWidth;

          if (newSpaceAvailable >= 0) {
            spaceAvailable = newSpaceAvailable;
            willFit += 1;
          }
        }

        // if not enough space for all items then make room for the overflow
        const overflowWidth = overflowItem.offsetWidth;
        if (willFit < sizingItems.length) {
          // Check space for overflow
          while (willFit > 0 && spaceAvailable < overflowWidth) {
            willFit -= 1;

            // Highly unlikely that any action bar item is narrower than the overflow item

            // Make sure by removing items in reverse order
            spaceAvailable += sizingItems[willFit].offsetWidth;
          }
        }

        // emit onWidthChange
        onWidthChange &&
          onWidthChange({
            maxWidth: maxVisibleWidth,
            minWidth: overflowWidth,
          });

        if (willFit < 1) {
          setDisplayCount(0);
        } else {
          setDisplayCount(willFit);
        }
      }
    };

    useEffect(() => {
      checkFullyVisibleItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxVisible, itemArray]);

    const handleResize = () => {
      // width is the space available for all action bar items horizontally
      // the action bar items are squares so the height should be one item wide
      /* istanbul ignore next */ // not sure how to fake window resize
      checkFullyVisibleItems();
    };

    const handleActionBarItemsResize = () => {
      // when the hidden sizing items change size
      checkFullyVisibleItems();
    };

    useResizeDetector({
      onResize: handleActionBarItemsResize,
      targetRef: sizingRef,
    });

    const { ref: outerRef } = useResizeDetector({
      onResize: handleResize,
      targetRef: ref,
    });

    return (
      <div {...rest} className={cx([blockClass, className])} ref={outerRef}>
        {hiddenSizingItems}

        <div
          ref={refDisplayedItems}
          className={cx([
            `${blockClass}__displayed-items`,
            { [`${blockClass}__displayed-items--right`]: rightAlign },
          ])}>
          {displayedItems}
        </div>
      </div>
    );
  }
);

ActionBar.displayName = componentName;
ActionBar.propTypes = {
  /**
   * Specifies the action bar items. Each item is specified as an object
   * with required fields: key for array rendering, renderIcon and
   * iconDescription to provide the icon to display,
   * and optional 'onClick' to receive notifications when the button is clicked.
   * Additional fields in the object will be passed to the
   * Button component, and these can include 'disabled', 'ref', 'className',
   * and any other Button props.
   *
   * Note that the Button props 'kind', 'size',
   * 'tooltipPosition', 'tooltipAlignment' and 'type' are ignored, as these
   * cannot be used for an action bar item.
   *
   * Carbon Button API https://react.carbondesignsystem.com/?path=/docs/components-button--default#component-api
   */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      ...prepareProps(Button.propTypes, [
        // props not desired from Button.propTypes
        'kind',
        'size',
        'tooltipPosition',
        'tooltipAlignment',
      ]),
      // Additional props
      key: PropTypes.string.isRequired,
      // Redefine as form different  to Button and a key prop used by ActionBarItems
      iconDescription: PropTypes.string.isRequired,
      renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
        .isRequired,
      // We duplicate onClick here to improve DocGen in Storybook
      onClick: PropTypes.func,
    })
  ),
  /**
   * children of the action bar (action bar items)
   */
  children: deprecateProp(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]),
    'See documentation on the `actions` prop.'
  ),
  // expects action bar item as array or in fragment,
  /**
   * className
   */
  className: PropTypes.string,
  /**
   * maxVisible : Maximum action bar items visible before going into the overflow menu
   */
  maxVisible: PropTypes.number,
  /**
   * onItemCountChange - event reporting maxWidth
   */
  onWidthChange: PropTypes.func,
  /**
   * overflowAriaLabel label for open close button overflow used for action bar items that do nto fit.
   */
  overflowAriaLabel: PropTypes.string.isRequired,
  /**
   * align tags to right of available space
   */
  rightAlign: PropTypes.bool,
};

ActionBar.defaultProps = {
  rightAlign: false,
};
