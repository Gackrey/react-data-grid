import styled from 'styled-components';
import clsx from 'clsx';

import type { RenderCheckboxProps } from '../types';

const StyledCheckboxInput = styled.input`
  @layer rdg.CheckboxInput {
    all: unset;
  }
`;

const StyledCheckbox = styled.div`
  @layer rdg.CheckboxIcon {
    content: '';
    inline-size: 20px;
    block-size: 20px;
    border: 2px solid var(--rdg-border-color);
    background-color: var(--rdg-background-color);

    ${StyledCheckboxInput}:checked + & {
      background-color: var(--rdg-checkbox-color);
      outline: 4px solid var(--rdg-background-color);
      outline-offset: -6px;
    }

    ${StyledCheckboxInput}:focus + & {
      border-color: var(--rdg-checkbox-focus-color);
    }
  }
`;

const StyledCheckboxLabel = styled.label`
  @layer rdg.CheckboxLabel {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    margin-inline-end: 1px; /* align checkbox in row group cell */
  }

  &.rdg-checkbox-label-disabled {
    @layer rdg.CheckboxLabel {
      cursor: default;

      ${StyledCheckbox} {
        border-color: var(--rdg-checkbox-disabled-border-color);
        background-color: var(--rdg-checkbox-disabled-background-color);
      }
    }
  }
`;

export function renderCheckbox({ onChange, ...props }: RenderCheckboxProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return (
    <StyledCheckboxLabel
      className={clsx('rdg-checkbox-label', {
        'rdg-checkbox-label-disabled': props.disabled
      })}
    >
      <StyledCheckboxInput
        type="checkbox"
        {...props}
        className="rdg-checkbox-input"
        onChange={handleChange}
      />
      <StyledCheckbox className="rdg-checkbox" />
    </StyledCheckboxLabel>
  );
}
