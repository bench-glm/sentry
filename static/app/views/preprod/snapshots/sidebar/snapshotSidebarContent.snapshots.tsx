import {ThemeProvider} from '@emotion/react';

// eslint-disable-next-line no-restricted-imports -- SSR snapshot rendering needs direct theme access
import {darkTheme, lightTheme} from 'sentry/utils/theme/theme';
import {DiffStatus, type SidebarItem} from 'sentry/views/preprod/types/snapshotTypes';

import {SnapshotSidebarContent} from './snapshotSidebarContent';

jest.mock('@sentry/scraps/layout', () => {
  const actual = jest.requireActual('@sentry/scraps/layout');
  return {
    ...actual,
    Stack: (props: any) => <actual.Flex direction="column" {...props} />,
  };
});

const themes = {light: lightTheme, dark: darkTheme};

const noop = () => {};

const items: SidebarItem[] = [
  {
    type: 'changed',
    key: 'changed:Button/light',
    name: 'Button/light',
    pairs: [
      {
        base_image: {
          display_name: 'Button/light/default',
          image_file_name: 'button-light-default-base.png',
          group: 'Button/light',
          height: 48,
          key: 'button-light-default-base',
          width: 160,
          content_hash: 'base-button-light-default',
        },
        diff: 0.12,
        diff_image_key: 'button-light-default-diff',
        head_image: {
          display_name: 'Button/light/default',
          image_file_name: 'button-light-default.png',
          group: 'Button/light',
          height: 48,
          key: 'button-light-default',
          width: 160,
          content_hash: 'head-button-light-default',
        },
      },
    ],
  },
  {
    type: 'changed',
    key: 'changed:Alert/dark',
    name: 'Alert/dark',
    pairs: Array.from({length: 3}, (_, index) => ({
      base_image: {
        display_name: `Alert/dark/${index}`,
        image_file_name: `alert-dark-${index}-base.png`,
        group: 'Alert/dark',
        height: 64,
        key: `alert-dark-${index}-base`,
        width: 240,
        content_hash: `base-alert-dark-${index}`,
      },
      diff: 0.05,
      diff_image_key: `alert-dark-${index}-diff`,
      head_image: {
        display_name: `Alert/dark/${index}`,
        image_file_name: `alert-dark-${index}.png`,
        group: 'Alert/dark',
        height: 64,
        key: `alert-dark-${index}`,
        width: 240,
        content_hash: `head-alert-dark-${index}`,
      },
    })),
  },
  {
    type: 'unchanged',
    key: 'unchanged:Badge/light',
    name: 'Badge/light',
    images: Array.from({length: 4}, (_, index) => ({
      display_name: `Badge/light/${index}`,
      image_file_name: `badge-light-${index}.png`,
      group: 'Badge/light',
      height: 32,
      key: `badge-light-${index}`,
      width: 96,
      content_hash: `badge-light-${index}`,
    })),
  },
  {
    type: 'unchanged',
    key: 'unchanged:Checkbox/theme-dark',
    name: 'Checkbox/theme-dark',
    images: Array.from({length: 2}, (_, index) => ({
      display_name: `Checkbox/theme-dark/${index}`,
      image_file_name: `checkbox-theme-dark-${index}.png`,
      group: 'Checkbox/theme-dark',
      height: 32,
      key: `checkbox-theme-dark-${index}`,
      width: 128,
      content_hash: `checkbox-theme-dark-${index}`,
    })),
  },
];

const statusCounts: Record<DiffStatus, number> = {
  [DiffStatus.CHANGED]: 2,
  [DiffStatus.ADDED]: 0,
  [DiffStatus.REMOVED]: 0,
  [DiffStatus.RENAMED]: 0,
  [DiffStatus.UNCHANGED]: 2,
};

describe('SnapshotSidebarContent', () => {
  describe.each(['light', 'dark'] as const)('%s', themeName => {
    function Wrapper({children}: {children: React.ReactNode}) {
      return (
        <ThemeProvider theme={themes[themeName]}>
          <div style={{height: 520, width: 350}}>{children}</div>
        </ThemeProvider>
      );
    }

    it.snapshot(
      'all-selected',
      () => (
        <Wrapper>
          <SnapshotSidebarContent
            items={items}
            currentItemKey="changed:Button/light"
            isAllSelected
            searchQuery=""
            onSearchChange={noop}
            onSelectItem={noop}
            onSelectAll={noop}
            statusCounts={statusCounts}
            activeStatuses={new Set()}
            onToggleStatus={noop}
          />
        </Wrapper>
      ),
      {theme: themeName, state: 'all-selected'}
    );

    it.snapshot(
      'child-selected',
      () => (
        <Wrapper>
          <SnapshotSidebarContent
            items={items}
            currentItemKey="unchanged:Badge/light"
            isAllSelected={false}
            searchQuery=""
            onSearchChange={noop}
            onSelectItem={noop}
            onSelectAll={noop}
            statusCounts={statusCounts}
            activeStatuses={new Set([DiffStatus.UNCHANGED])}
            onToggleStatus={noop}
          />
        </Wrapper>
      ),
      {theme: themeName, state: 'child-selected'}
    );

    it.snapshot(
      'no-results',
      () => (
        <Wrapper>
          <SnapshotSidebarContent
            items={[]}
            currentItemKey={null}
            isAllSelected
            searchQuery="missing"
            onSearchChange={noop}
            onSelectItem={noop}
            onSelectAll={noop}
            statusCounts={statusCounts}
            activeStatuses={new Set([DiffStatus.CHANGED, DiffStatus.UNCHANGED])}
            onToggleStatus={noop}
          />
        </Wrapper>
      ),
      {theme: themeName, state: 'no-results'}
    );
  });
});
