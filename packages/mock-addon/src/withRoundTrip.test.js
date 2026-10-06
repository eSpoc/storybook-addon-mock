import faker from './utils/faker';
import { withRoundTrip } from './withRoundTrip';

jest.mock(
    'storybook/internal/core-events',
    () => ({ STORY_CHANGED: 'storyChanged', FORCE_RE_RENDER: 'forceReRender' }),
    { virtual: true }
);
jest.mock(
    'storybook/preview-api',
    () => {
        const listeners = {};
        const channel = {
            emit: (event, ...args) =>
                (listeners[event] || []).forEach((fn) => fn(...args)),
            on: (event, fn) => {
                listeners[event] = [...(listeners[event] || []), fn];
            },
        };
        return { addons: { getChannel: () => channel } };
    },
    { virtual: true }
);

const mock = (url, status) => ({ url, method: 'GET', status, response: {} });

const render = (id, mockData) =>
    withRoundTrip(() => 'rendered', { id, parameters: { mockData } });

const statusFor = (url) =>
    faker.getRequests().find((request) => request.url === url)?.status;

describe('withRoundTrip', () => {
    // Portable stories (Vitest, composeStories) never emit STORY_CHANGED.
    it('rebuilds the request map when the story id changes', () => {
        render('fax--sends', [mock('/fax', 200)]);
        expect(statusFor('/fax')).toBe(200);

        render('fax--send-fails', [mock('/fax', 500)]);
        expect(statusFor('/fax')).toBe(500);
    });

    it('keeps the request map when the same story re-renders', () => {
        render('fax--retry', [mock('/fax', 200)]);
        faker.update(faker.getRequests()[0], 'status', 404);

        render('fax--retry', [mock('/fax', 200)]);
        expect(statusFor('/fax')).toBe(404);
    });
});
