import * as XLSX from 'xlsx';

export function exportToJSON(data: any, filename = '17an_arena_data_backup.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(rows: Record<string, any>[], filename = 'export.csv') {
  if (!rows || rows.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToXLSX(tables: { name: string; data: Record<string, any>[] }[], filename = '17an_arena_report.xlsx') {
  const workbook = XLSX.utils.book_new();
  
  tables.forEach((table) => {
    const worksheet = XLSX.utils.json_to_sheet(table.data.length > 0 ? table.data : [{}]);
    XLSX.utils.book_append_sheet(workbook, worksheet, table.name.substring(0, 31));
  });

  XLSX.writeFile(workbook, filename);
}

export function exportToSQL(tableName: string, rows: Record<string, any>[], filename = `${tableName}.sql`) {
  if (!rows || rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  let sql = `-- 17an Arena Database Export\n-- Table: ${tableName}\n-- Generated at: ${new Date().toLocaleString()}\n\n`;
  
  sql += `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n`;
  sql += columns.map(col => `  \`${col}\` TEXT`).join(',\n');
  sql += `\n);\n\n`;

  rows.forEach(row => {
    const values = columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number' || typeof val === 'boolean') return val;
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    sql += `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${values.join(', ')});\n`;
  });

  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
