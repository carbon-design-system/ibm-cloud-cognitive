/**
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BreadcrumbItem } from 'carbon-components-react';
import { BreadcrumbWithOverflow } from '.';
import { mockHTMLElement } from '../../global/js/utils/test-helper';

import { carbon } from '../../settings';
import uuidv4 from '../../global/js/utils/uuidv4';

const dataTestId = uuidv4();

const breadcrumbContent = [];
for (let i = 1; i <= 5; i++) {
  breadcrumbContent.push(`Breadcrumb ${i}`);
}
const breadcrumbItems = breadcrumbContent.map((item) => (
  <BreadcrumbItem key={item}>
    <a href="/#" onClick={() => {}}>
      {item}
    </a>
  </BreadcrumbItem>
));

const sizes = {
  breadcrumbWidth: 200,
  breadcrumbHeight: 40,
  breadcrumbMargin: 10,
};

const isBreadCrumbItem = function () {
  return this.classList?.contains(`${carbon.prefix}--breadcrumb-item`) || false;
};

// eslint-disable-next-line react/prop-types
const TestBreadcrumbWithOverflow = ({ width, children, ...rest }) => {
  return (
    <div style={{ width, height: 40 }}>
      <BreadcrumbWithOverflow className="fish" {...rest}>
        {children}
      </BreadcrumbWithOverflow>
    </div>
  );
};

describe(BreadcrumbWithOverflow.displayName, () => {
  const { ResizeObserver } = window;
  let mockElement;

  beforeEach(() => {
    mockElement = mockHTMLElement({
      marginLeft: {
        value: sizes.breadcrumbMargin,
      },
      marginRight: {
        value: sizes.breadcrumbMargin,
      },
      offsetWidth: {
        get: function () {
          // const classList = [];
          // this.classList.forEach((val) => classList.push(val));
          // console.log(classList);
          if (isBreadCrumbItem.bind(this)()) {
            return sizes.breadcrumbWidth;
          } else {
            // return width of test environment
            return (
              parseInt(this.style.width, 10) || this.parentNode.offsetWidth
            );
          }
        },
      },
      offsetHeight: {
        get: function () {
          if (isBreadCrumbItem.bind(this)()) {
            return sizes.breadcrumbHeight;
          } else {
            // return height of test environment
            return (
              parseInt(this.style.height, 10) || this.parentNode.offsetHeight
            );
          }
        },
      },
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    mockElement.mockRestore();
    jest.restoreAllMocks();
    window.ResizeObserver = ResizeObserver;
  });

  const { click } = fireEvent;

  it('Renders all as visible breadcrumbs when space available', () => {
    const plentyOfSpace = (breadcrumbItems.length + 1) * sizes.breadcrumbWidth;

    render(
      <TestBreadcrumbWithOverflow
        width={plentyOfSpace}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );

    const visibleBreadcrumbs = screen.getAllByRole('listitem');
    expect(visibleBreadcrumbs.length).toEqual(5); // all should be visible

    breadcrumbContent.forEach((item, index) => {
      expect(visibleBreadcrumbs[index]).toHaveTextContent(item);
    });
  });

  it('Renders first and last items when not enough space for all', () => {
    const reduceSpaceBy = 1;
    const notEnoughSpace =
      (breadcrumbItems.length - reduceSpaceBy) * sizes.breadcrumbWidth;
    const overflowItemsExpected = reduceSpaceBy + 1; // + 1 as space for overflow button needed also

    render(
      <TestBreadcrumbWithOverflow
        width={notEnoughSpace}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );

    const visibleBreadcrumbs = screen.getAllByRole('listitem');
    // not enough room
    expect(visibleBreadcrumbs.length).toEqual(
      breadcrumbItems.length - reduceSpaceBy
    );

    expect(visibleBreadcrumbs[0]).toHaveTextContent(breadcrumbContent[0]);
    // last item is last breadcrumb
    expect(visibleBreadcrumbs[visibleBreadcrumbs.length - 1]).toHaveTextContent(
      breadcrumbContent[4]
    );

    // item 2 contains an overflow menu
    const overflowBtn = screen.getByRole('button');
    click(overflowBtn);

    // <ul role='menu' /> but default <ul> role of list used for query
    // see https://testing-library.com/docs/queries/byrole/#api
    // const om = screen.getByRole('list');
    // const menuItems = screen.getAllByRole('menuitem');
    // use querySelectorAll rather that getAllByRole because the drop-down
    // never fully appears in jsdom (requires resize handler mocking)
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    expect(menuItems).toHaveLength(overflowItemsExpected);
    expect(menuItems[0]).toHaveTextContent(breadcrumbContent[1]);
    expect(menuItems[1]).toHaveTextContent(breadcrumbContent[2]);
  });

  it('Renders just the breadcrumb and last item when very little space', () => {
    const notEnoughSpace = 1.1 * sizes.breadcrumbWidth;

    render(
      <TestBreadcrumbWithOverflow
        width={notEnoughSpace}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );

    const visibleBreadcrumbs = screen.getAllByRole('listitem');
    // not enough room
    expect(visibleBreadcrumbs.length).toEqual(2); // last + overflow

    // last item is last breadcrumb
    expect(visibleBreadcrumbs[1]).toHaveTextContent(breadcrumbContent[4]);

    // item 2 contains an overflow menu
    const overflowBtn = screen.getByRole('button');
    expect(overflowBtn).toBeTruthy();
  });

  it('Renders just the breadcrumb obeying maxVisible', () => {
    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={3}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );

    const visibleBreadcrumbs = screen.getAllByRole('listitem');
    // not enough room
    expect(visibleBreadcrumbs.length).toEqual(4);

    // last item is last breadcrumb
    expect(visibleBreadcrumbs[3]).toHaveTextContent(breadcrumbContent[4]);

    // item 2 contains an overflow menu
    const overflowBtn = screen.getByRole('button');
    expect(overflowBtn).toBeTruthy();
  });

  it('Renders just the breadcrumb obeying maxVisible', () => {
    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );

    const visibleBreadcrumbs = screen.getAllByRole('listitem');
    // not enough room
    expect(visibleBreadcrumbs.length).toEqual(2);

    // last item is last breadcrumb
    expect(visibleBreadcrumbs[1]).toHaveTextContent(breadcrumbContent[4]);

    // item 2 contains an overflow menu
    const overflowBtn = screen.getByRole('button');
    expect(overflowBtn).toBeTruthy();
  });

  it('adds additional properties to an breadcrumb with overflow', () => {
    render(
      <TestBreadcrumbWithOverflow
        data-testid={dataTestId}
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {breadcrumbItems}
      </TestBreadcrumbWithOverflow>
    );
    screen.getByTestId(dataTestId);
  });

  it('Uses data-title if supplied', () => {
    const testTitle = 'test-title';

    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {[
          <BreadcrumbItem key="k1" href="/#" data-title={testTitle}>
            Item 1
          </BreadcrumbItem>,
        ]}
      </TestBreadcrumbWithOverflow>
    );
    expect(screen.getByText(testTitle)).not.toBeNull();
  });

  it('Uses title if supplied', () => {
    const testTitle = 'test-title';

    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {[
          <BreadcrumbItem key="k2" href="/#" title={testTitle}>
            Item 2
          </BreadcrumbItem>,
        ]}
      </TestBreadcrumbWithOverflow>
    );
    expect(screen.getByText(testTitle)).not.toBeNull();
  });

  it('Uses props.children as title if type string', () => {
    const testTitle = 'test-title';

    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {[
          <BreadcrumbItem key="k3" href="/#">
            {testTitle}
          </BreadcrumbItem>,
        ]}
      </TestBreadcrumbWithOverflow>
    );
    expect(
      screen.getByText(testTitle, {
        selector: `.${carbon.prefix}--assistive-text`,
      })
    ).not.toBeNull();
  });

  it('Uses props.children.props.children type string', () => {
    const testTitle = 'test-title';

    render(
      <TestBreadcrumbWithOverflow
        width={1200}
        maxVisible={0}
        overflowAriaLabel="Open and close additional breadcrumb item list.">
        {[
          <BreadcrumbItem key="k4">
            <a href="/#">{testTitle}</a>
          </BreadcrumbItem>,
        ]}
      </TestBreadcrumbWithOverflow>
    );
    expect(
      screen.getByText(testTitle, {
        selector: `.${carbon.prefix}--assistive-text`,
      })
    ).not.toBeNull();
  });
});
