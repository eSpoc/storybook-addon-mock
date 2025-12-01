import React from 'react';
import { ADDON_ID, PANEL_ID } from './utils/constants';
import { Panel } from './components/Panel';
import { addons, types } from 'storybook/manager-api';

addons.register(ADDON_ID, (api) => {
    // Register the panel
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: 'Mock Request',
        match: ({ viewMode }) => viewMode === 'story',
        render: (renderProps) => {
            return React.createElement(Panel, { key: PANEL_ID, ...renderProps });
        },
        paramKey: 'mockAddonConfigs',
    });
});
