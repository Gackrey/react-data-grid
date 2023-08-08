import styled from 'styled-components';

import type { RenderHeaderCellProps } from './types';
import { useDefaultRenderers } from './DataGridDefaultRenderersProvider';

const StyledHeaderSortCell = styled.span`
  @layer rdg.SortableHeaderCell {
    cursor: pointer;
    display: flex;

    &:focus {
      outline: none;
    }
  }
`;

const StyledHeaderSortName = styled.span`
  @layer rdg.SortableHeaderCellName {
    flex-grow: 1;
    overflow: hidden;
    overflow: clip;
    text-overflow: ellipsis;
  }
`;

const StyledHeaderSortWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export default function renderHeaderCell<R, SR>({
  column,
  sortDirection,
  priority,
  onSort,
  tabIndex
}: RenderHeaderCellProps<R, SR>) {
  if (!column.sortable) return column.title;

  return (
    <SortableHeaderCell
      onSort={onSort}
      sortDirection={sortDirection}
      priority={priority}
      tabIndex={tabIndex}
    >
      {column.title}
    </SortableHeaderCell>
  );
}

type SharedHeaderCellProps<R, SR> = Pick<
  RenderHeaderCellProps<R, SR>,
  'sortDirection' | 'onSort' | 'priority' | 'tabIndex'
>;

interface SortableHeaderCellProps<R, SR> extends SharedHeaderCellProps<R, SR> {
  children: React.ReactNode;
}

function SortableHeaderCell<R, SR>({
  onSort,
  sortDirection,
  priority,
  children,
  tabIndex
}: SortableHeaderCellProps<R, SR>) {
  const renderSortStatus = useDefaultRenderers<R, SR>()!.renderSortStatus!;

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === ' ' || event.key === 'Enter') {
      // stop propagation to prevent scrolling
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey);
    }
  }

  function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
    onSort(event.ctrlKey || event.metaKey);
  }

  return (
    <StyledHeaderSortCell
      tabIndex={tabIndex}
      className="rdg-header-sort-cell "
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <StyledHeaderSortName className="rdg-header-sort-name">{children}</StyledHeaderSortName>
      <StyledHeaderSortWrapper>
        {renderSortStatus({ sortDirection, priority })}
      </StyledHeaderSortWrapper>
    </StyledHeaderSortCell>
  );
}
