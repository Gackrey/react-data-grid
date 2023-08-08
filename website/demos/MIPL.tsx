import { useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';

import DataGrid, { SelectCellFormatter, SelectColumn } from '../../src';
import type { Column, SortColumn } from '../../src';
import { textEditorClassname } from '../../src/editors/textEditor';
import type { Props } from './types';

const dateFormatter = new Intl.DateTimeFormat(navigator.language);
const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'eur'
});

interface Row {
  id: number;
  title: string;
  client: string;
  area: string;
  country: string;
  contact: string;
  assignee: string;
  progress: number;
  startTimestamp: number;
  endTimestamp: number;
  budget: number;
  transaction: string;
  account: string;
  version: string;
  available: boolean;
}

function getColumns(countries: readonly string[]): readonly Column<Row>[] {
  return [
    SelectColumn,
    {
      key: 'id',
      title: 'ID',
      render: (value) => <span>Rs {value}</span>
    },
    {
      key: 'title',
      title: 'Task',
      sortable: true
    },
    {
      key: 'client',
      title: 'Client',
      width: 'max-content',
      sortable: true
    },
    {
      key: 'area',
      title: 'Area'
    },
    {
      key: 'country',
      title: 'Country',
      renderEditCell: (p) => (
        <select
          autoFocus
          className={textEditorClassname}
          value={p.row.country}
          onChange={(e) => p.onRowChange({ ...p.row, country: e.target.value }, true)}
        >
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      )
    },
    {
      key: 'contact',
      title: 'Contact'
    },
    {
      key: 'assignee',
      title: 'Assignee'
    },
    {
      key: 'progress',
      title: 'Completion',
      render(value) {
        return (
          <>
            <progress max={100} value={+value} style={{ inlineSize: 50 }} /> {Math.round(+value)}%
          </>
        );
      }
    },
    {
      key: 'startTimestamp',
      title: 'Start date',
      renderCell(props) {
        return dateFormatter.format(props.row.startTimestamp);
      }
    },
    {
      key: 'endTimestamp',
      title: 'Deadline',
      renderCell(props) {
        return dateFormatter.format(props.row.endTimestamp);
      }
    },
    {
      key: 'budget',
      title: 'Budget',
      renderCell(props) {
        return currencyFormatter.format(props.row.budget);
      }
    },
    {
      key: 'transaction',
      title: 'Transaction type'
    },
    {
      key: 'account',
      title: 'Account'
    },
    {
      key: 'version',
      title: 'Version'
    },
    {
      key: 'available',
      frozen: true,
      title: 'Available',
      renderCell({ row, onRowChange, tabIndex }) {
        return (
          <SelectCellFormatter
            value={row.available}
            onChange={() => {
              onRowChange({ ...row, available: !row.available });
            }}
            tabIndex={tabIndex}
          />
        );
      }
    }
  ];
}

function rowKeyGetter(row: Row) {
  return row.id;
}

function createRows(): readonly Row[] {
  const now = Date.now();
  const rows: Row[] = [];

  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      client: faker.company.name(),
      area: faker.person.jobArea(),
      country: faker.location.country(),
      contact: faker.internet.exampleEmail(),
      assignee: faker.person.fullName(),
      progress: Math.random() * 100,
      startTimestamp: now - Math.round(Math.random() * 1e10),
      endTimestamp: now + Math.round(Math.random() * 1e10),
      budget: 500 + Math.random() * 10500,
      transaction: faker.finance.transactionType(),
      account: faker.finance.iban(),
      version: faker.system.semver(),
      available: Math.random() > 0.5
    });
  }

  return rows;
}

const onSortOrder = (a: Row, b: Row, key: keyof Row, type = 'number') => {
  if (type === 'number')
    return (
      (typeof a[key] === 'number' ? (a[key] as number) : 0) -
      (typeof b[key] === 'number' ? (b[key] as number) : 0)
    );
  if (type === 'string') return (a[key] as string).localeCompare(b[key] as string);
  return (a[key] as number) - (b[key] as number);
};

export default function CommonFeatures({ direction }: Props) {
  const [rows, setRows] = useState(createRows);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());

  const countries = useMemo((): readonly string[] => {
    return [...new Set(rows.map((r) => r.country))].sort(new Intl.Collator().compare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = useMemo(() => getColumns(countries), [countries]);

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const compResult = onSortOrder(
          a,
          b,
          sort.columnKey as keyof Row,
          typeof a[sort.columnKey as keyof Row]
        );

        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);

  return (
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={sortedRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onRowsChange={setRows}
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      className="fill-grid"
      direction={direction}
      rowHeight={58}
      border={false}
    />
  );
}
