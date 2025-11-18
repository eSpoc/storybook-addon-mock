import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from 'storybook/theming';
import { Form, Placeholder } from 'storybook/internal/components';
import { Card } from './Card';
import statusTextMap from '../utils/statusMap';

const statusCodes = Object.keys(
    statusTextMap
) as unknown as (keyof typeof statusTextMap)[];

const { Field: SBField, Select, Textarea } = Form;

const Method = styled.div`
    font-weight: 700;
    border-right: 1px solid ${({ theme }) => theme.appBorderColor};
`;

const Url = styled.div`
    flex: 1;
    overflow-x: auto;
`;

const UrlMethodContainer = styled.div`
    display: flex;
    align-items: center;
    border: ${({ theme }) => theme.input.border};
    background: ${({ theme }) => theme.input.background};
    border-radius: ${({ theme }) => theme.input.borderRadius};

    > * {
        padding: 0.5rem 0.75rem;
    }
`;

const StatusDelayContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex: 1 0 0;
    padding: 0.5rem 0.75rem;
    gap: 1rem;

    > label:last-child {
        margin-bottom: 0;
    }
`;

const Field = styled(SBField)`
    border: none;
    flex: 1;
    padding: 0;
    margin: 0;

    > span {
        min-width: 0;
        margin-right: 0.75rem;
    }

    > select {
        width: 6em;
        flex: 1 1 auto;
    }

    & input {
        min-width: 2em;
    }
`;

const Fieldset = styled.fieldset`
    border: 1px solid ${({ theme }) => theme.appBorderColor};
    background: ${({ theme }) => theme.input.background};
    border-radius: 0.5rem;
    margin: 0 0 1rem;
    padding: 0;

    display: flex;
    flex: 1 0 0;

    > legend {
        margin-inline-start: calc(0.75rem - 2px);
        font-weight: bold;
    }

    > div {
        flex: 1 0 0;
        margin: 1rem;
        position: relative;
    }
`;

const RangeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const RangeInput = styled.input`
    flex: 1;
    min-width: 0;
`;

const RangeValue = styled.span`
    min-width: 4em;
    text-align: right;
    font-variant-numeric: tabular-nums;
`;

const JsonTextarea = styled(Textarea)`
    font-family: monospace;
    min-height: 100px;
    resize: vertical;
`;

const ErrorText = styled.div`
    color: ${({ theme }) => theme.color.negative};
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

export const MockItem = ({
    id: _id,
    url,
    method,
    status,
    skip,
    response,
    delay,
    onChange,
    disableUsingOriginal,
}: {
    id: string | number;
    url: string;
    method: string;
    status: string | number;
    skip: boolean;
    response: unknown;
    delay: number;
    onChange: (key: string, value: unknown) => void;
    disableUsingOriginal: boolean;
}) => {
    const [jsonError, setJsonError] = useState<string>('');
    const responseStr =
        typeof response === 'string'
            ? response
            : JSON.stringify(response, null, 2);

    const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        try {
            const parsed = JSON.parse(value);
            setJsonError('');
            onChange('response', parsed);
        } catch (err) {
            setJsonError(
                err instanceof Error ? err.message : 'Invalid JSON'
            );
        }
    };

    return (
        <Card
            onToggle={(value) => onChange('skip', !value)}
            enabled={!skip}
            showHeader={!disableUsingOriginal}
        >
            <UrlMethodContainer>
                <Method>{method}</Method>
                <Url>{url}</Url>
            </UrlMethodContainer>
            <StatusDelayContainer>
                <Field label="Status">
                    <Select
                        onChange={(event) =>
                            onChange('status', event.target.value)
                        }
                        value={status}
                        name="status"
                    >
                        {statusCodes.map((code) => (
                            <option key={code} value={code}>
                                {code} - {statusTextMap[code]}
                            </option>
                        ))}
                    </Select>
                </Field>
                <Field label="Delay">
                    <RangeContainer>
                        <RangeInput
                            type="range"
                            name="delay"
                            value={delay}
                            onChange={(e) =>
                                onChange('delay', Number(e.target.value))
                            }
                            min={0}
                            max={10000}
                            step={500}
                        />
                        <RangeValue>{delay}ms</RangeValue>
                    </RangeContainer>
                </Field>
            </StatusDelayContainer>
            <Fieldset>
                <legend>Response</legend>
                {typeof response === 'function' ? (
                    <Placeholder>
                        This is a custom function. You can only change it from
                        the declaration.
                    </Placeholder>
                ) : (
                    <div>
                        <JsonTextarea
                            name="response"
                            value={responseStr}
                            onChange={handleResponseChange}
                        />
                        {jsonError && <ErrorText>{jsonError}</ErrorText>}
                    </div>
                )}
            </Fieldset>
        </Card>
    );
};

MockItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    skip: PropTypes.bool.isRequired,
    response: PropTypes.any,
    delay: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disableUsingOriginal: PropTypes.bool.isRequired,
};
