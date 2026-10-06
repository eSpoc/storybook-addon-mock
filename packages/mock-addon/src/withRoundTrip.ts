import type { DecoratorFunction, Parameters } from 'storybook/internal/types';

import { FORCE_RE_RENDER, STORY_CHANGED } from 'storybook/internal/core-events';
import { EVENTS, PARAM_KEY, GLOBAL_PARAM_KEY } from './utils/constants';
import faker from './utils/faker';
import { addons } from 'storybook/preview-api';

const getParameter = <T = unknown>(
    parameters: Parameters,
    key: string,
    defaultValue: T
): T => {
    return parameters[key] || defaultValue;
};

let INITIAL_MOUNT_STATE = true;
let STORY_CHANGED_STATE = false;
let LAST_STORY_ID: string | undefined;

const channel = addons.getChannel();

export const withRoundTrip: DecoratorFunction = (storyFn, context) => {
    const { parameters } = context;
    const paramData = getParameter(parameters, PARAM_KEY, []);
    const mockAddonConfigs = getParameter(parameters, GLOBAL_PARAM_KEY, {
        refreshStoryOnUpdate: false,
        globalMockData: [],
        disableUsingOriginal: false,
        ignoreQueryParams: false,
    });
    const {
        globalMockData,
        refreshStoryOnUpdate,
        disableUsingOriginal,
        ignoreQueryParams,
    } = mockAddonConfigs;
    const data = [...globalMockData, ...paramData];

    /**
     * Initiate event listener for story change and update.
     * This state executes once to setup.
     */
    if (INITIAL_MOUNT_STATE) {
        faker.makeInitialRequestMap(data);
        faker.setIgnoreQueryParams(ignoreQueryParams);

        channel.emit(EVENTS.SEND, {
            mockData: faker.getRequests(),
            disableUsingOriginal,
        });

        channel.on(STORY_CHANGED, () => {
            STORY_CHANGED_STATE = true;
        });

        channel.on(EVENTS.UPDATE, ({ item, key, value }) => {
            faker.update(item, key, value);
            const req = faker.getRequests();
            channel.emit(EVENTS.SEND, {
                mockData: req,
                disableUsingOriginal,
            });
            if (refreshStoryOnUpdate) {
                channel.emit(FORCE_RE_RENDER);
            }
        });

        INITIAL_MOUNT_STATE = false;
        LAST_STORY_ID = context.id;
    }

    /**
     * This state executes when a story change. So that it can
     * take the new parameters to setup the faker requests.
     *
     * The story id is compared as well as STORY_CHANGED: the Storybook UI
     * emits that event on every story switch, but portable stories (Vitest,
     * composeStories) render a file's stories back to back without it, and
     * each later story kept the first story's mocks. Re-renders of the same
     * story keep the map, so edits from the panel survive.
     */
    if (STORY_CHANGED_STATE || context.id !== LAST_STORY_ID) {
        faker.makeInitialRequestMap(data);
        faker.setIgnoreQueryParams(ignoreQueryParams);

        channel.emit(EVENTS.SEND, {
            mockData: faker.getRequests(),
            disableUsingOriginal,
        });

        STORY_CHANGED_STATE = false;
    }
    LAST_STORY_ID = context.id;
    return storyFn(context);
};
