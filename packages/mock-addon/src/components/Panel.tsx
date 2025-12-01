import React from 'react';
import { useAddonState, useChannel } from 'storybook/manager-api';
import {
    AddonPanel,
    Placeholder,
    ScrollArea,
} from 'storybook/internal/components';

import { ADDON_ID, EVENTS } from '../utils/constants';
import { MockItem } from './MockItem';
import { ErrorItem } from './ErrorItem';
import type { Addon_RenderOptions } from 'storybook/internal/types';

interface MockData {
    url: string;
    method: string;
    status: string | number;
    skip: boolean;
    delay: number;
    response?: unknown;
    path: string;
    searchParamKeys: string[];
    errors?: string[];
    originalRequest?: Record<string, unknown>;
}

export const Panel = (props: Partial<Addon_RenderOptions>) => {
    const [state, setState] = useAddonState<{
        disableUsingOriginal: boolean;
        mockData: MockData[];
    }>(ADDON_ID, {
        mockData: [],
        disableUsingOriginal: false,
    });
    const emit = useChannel({
        [EVENTS.SEND]: (newState) => {
            setState(newState);
        },
    });

    const onChange = (item: MockData, key: string, value: unknown) => {
        emit(EVENTS.UPDATE, { item, key, value });
    };

    const { mockData = [], disableUsingOriginal } = state;

    return (
        <AddonPanel {...props} active={props.active ?? false}>
            {mockData.length === 0 ? (
                <Placeholder>No mock data found.</Placeholder>
            ) : (
                <ScrollArea vertical horizontal>
                    {mockData.map((item, index) => {
                        const { errors, originalRequest } = item;
                        if (errors?.length && originalRequest) {
                            return (
                                <ErrorItem
                                    key={index}
                                    errors={errors}
                                    originalRequest={originalRequest}
                                    position={index}
                                />
                            );
                        }

                        const {
                            searchParamKeys: _searchParamKeys,
                            path: _path,
                            errors: _errors,
                            originalRequest: _originalRequest,
                            response,
                            ...rest
                        } = item;

                        return (
                            <MockItem
                                id={index}
                                key={index}
                                onChange={(key, value) =>
                                    onChange(item, key, value)
                                }
                                disableUsingOriginal={disableUsingOriginal}
                                response={response}
                                {...rest}
                            />
                        );
                    })}
                </ScrollArea>
            )}
        </AddonPanel>
    );
};
