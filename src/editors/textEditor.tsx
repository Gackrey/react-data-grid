import styled from 'styled-components';

import type { RenderEditCellProps } from '../types';

const StyledTextEditorInternal = styled.input`
  &.rdg-editor {
    @layer rdg.TextEditor {
      appearance: none;

      box-sizing: border-box;
      inline-size: 100%;
      block-size: 100%;
      padding-block: 0;
      padding-inline: 6px;
      border: 2px solid #ccc;
      vertical-align: top;
      color: var(--rdg-color);
      background-color: var(--rdg-background-color);

      font-family: inherit;
      font-size: var(--rdg-font-size);

      &:focus {
        border-color: var(--rdg-selection-color);
        outline: none;
      }

      &::placeholder {
        color: #999;
        opacity: 1;
      }
    }
  }
`;

export const textEditorClassname = 'rdg-text-editor rdg-editor';

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export default function textEditor<TRow, TSummaryRow>({
  row,
  column,
  onRowChange,
  onClose
}: RenderEditCellProps<TRow, TSummaryRow>) {
  return (
    <StyledTextEditorInternal
      className="rdg-text-editor"
      ref={autoFocusAndSelect}
      value={row[column.key as keyof TRow] as unknown as string}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true, false)}
    />
  );
}
