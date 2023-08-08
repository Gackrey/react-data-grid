import { memo } from 'react';
import styled from 'styled-components';
import { css } from '@linaria/core';
import clsx from 'clsx';

import { getColSpan, getRowStyle } from './utils';
import type { RenderRowProps } from './types';
import { cell, cellFrozen } from './style/cell';
import { rowClassname, rowSelectedClassname } from './style/row';
import SummaryCell from './SummaryCell';

type SharedRenderRowProps<R, SR> = Pick<
  RenderRowProps<R, SR>,
  'viewportColumns' | 'rowIdx' | 'gridRowStart' | 'selectCell'
>;

interface SummaryRowProps<R, SR> extends SharedRenderRowProps<R, SR> {
  'aria-rowindex': number;
  row: SR;
  top: number | undefined;
  bottom: number | undefined;
  lastFrozenColumnIndex: number;
  selectedCellIdx: number | undefined;
  isTop: boolean;
  showBorder: boolean;
}

const StyledSummaryRow = styled.div`
  &.rdg-summary-row {
    @layer rdg.SummaryRow {
      line-height: var(--rdg-summary-row-height);

      > .${cell} {
        position: sticky;
      }
    }
  }

  &.rdg-top-summary-row {
    @layer rdg.SummaryRow {
      > .${cell} {
        z-index: 2;
      }

      > .${cellFrozen} {
        z-index: 3;
      }
    }
  }
  &.top-summary-row-border {
    @layer rdg.SummaryRow {
      > .${cell} {
        border-block-end: 2px solid var(--rdg-summary-border-color);
      }
    }
  }
  &.bottom-summary-row-border {
    @layer rdg.SummaryRow {
      > .${cell} {
        border-block-start: 2px solid var(--rdg-summary-border-color);
      }
    }
  }
`;

export const topSummaryRowBorderClassname = css`
  @layer rdg.SummaryRow {
    > .${cell} {
      border-block-end: 2px solid var(--rdg-summary-border-color);
    }
  }
`;

export const bottomSummaryRowBorderClassname = css`
  @layer rdg.SummaryRow {
    > .${cell} {
      border-block-start: 2px solid var(--rdg-summary-border-color);
    }
  }
`;

function SummaryRow<R, SR>({
  rowIdx,
  gridRowStart,
  row,
  viewportColumns,
  top,
  bottom,
  lastFrozenColumnIndex,
  selectedCellIdx,
  isTop,
  showBorder,
  selectCell,
  'aria-rowindex': ariaRowIndex
}: SummaryRowProps<R, SR>) {
  const cells = [];
  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, { type: 'SUMMARY', row });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    const isCellSelected = selectedCellIdx === column.idx;

    cells.push(
      <SummaryCell<R, SR>
        key={column.key}
        column={column}
        colSpan={colSpan}
        row={row}
        rowIdx={rowIdx}
        isCellSelected={isCellSelected}
        selectCell={selectCell}
      />
    );
  }

  return (
    <StyledSummaryRow
      role="row"
      aria-rowindex={ariaRowIndex}
      className={clsx(
        rowClassname,
        `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
        'rdg-summary-row',
        {
          [rowSelectedClassname]: selectedCellIdx === -1,
          'rdg-top-summary-row': isTop,
          'top-summary-row-border': isTop && showBorder,
          'bottom-summary-row-border': !isTop && showBorder,
          'rdg-bottom-summary-row': !isTop
        }
      )}
      style={
        {
          ...getRowStyle(gridRowStart),
          '--rdg-summary-row-top': top !== undefined ? `${top}px` : undefined,
          '--rdg-summary-row-bottom': bottom !== undefined ? `${bottom}px` : undefined
        } as unknown as React.CSSProperties
      }
    >
      {cells}
    </StyledSummaryRow>
  );
}

export default memo(SummaryRow) as <R, SR>(props: SummaryRowProps<R, SR>) => JSX.Element;
