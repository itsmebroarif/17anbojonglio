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

function escapeSqlValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'object') {
    const json = JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${json}'`;
  }
  const str = String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
  return `'${str}'`;
}

export function exportFullMySQLDump(data: {
  competitions?: any[];
  participants?: any[];
  registrations?: any[];
  winners?: any[];
  committees?: any[];
  doorprizes?: any[];
  history?: any[];
}): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const dbName = `db_perlombaan_${dtStr}`;

  let sql = `-- ============================================================
-- Arena 17an MySQL Database Dump (Navicat / SQLyog / HeidiSQL / phpMyAdmin Compatible)
-- Exported Date: ${now.toLocaleString('id-ID')}
-- Target Database: ${dbName}
-- ============================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${dbName}\`;

`;

  const buildTableDump = (tableName: string, createTableSql: string, rows: any[], columns: string[]) => {
    let out = `-- ------------------------------------------------------------\n`;
    out += `-- Table structure for \`${tableName}\`\n`;
    out += `-- ------------------------------------------------------------\n`;
    out += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    out += `${createTableSql}\n\n`;

    if (rows && rows.length > 0) {
      out += `-- Dumping data for table \`${tableName}\`\n`;
      out += `LOCK TABLES \`${tableName}\` WRITE;\n`;
      
      const colList = columns.map(c => `\`${c}\``).join(', ');
      out += `INSERT INTO \`${tableName}\` (${colList}) VALUES\n`;
      
      const valueRows = rows.map(r => {
        const vals = columns.map(c => escapeSqlValue(r[c]));
        return `(${vals.join(', ')})`;
      });
      
      out += valueRows.join(',\n') + `;\n`;
      out += `UNLOCK TABLES;\n\n`;
    }
    return out;
  };

  // 1. competitions
  sql += buildTableDump(
    'competitions',
    `CREATE TABLE \`competitions\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`category\` varchar(100) DEFAULT NULL,
  \`status\` varchar(50) DEFAULT NULL,
  \`maxParticipants\` int(11) DEFAULT 30,
  \`pointFirst\` int(11) DEFAULT 100,
  \`pointSecond\` int(11) DEFAULT 75,
  \`pointThird\` int(11) DEFAULT 50,
  \`location\` varchar(255) DEFAULT NULL,
  \`prefix\` varchar(20) DEFAULT NULL,
  \`description\` text,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.competitions || [],
    ['id', 'name', 'category', 'status', 'maxParticipants', 'pointFirst', 'pointSecond', 'pointThird', 'location', 'prefix', 'description']
  );

  // 2. participants
  sql += buildTableDump(
    'participants',
    `CREATE TABLE \`participants\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`age\` int(11) DEFAULT NULL,
  \`gender\` varchar(10) DEFAULT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`rtRw\` varchar(100) DEFAULT NULL,
  \`teamName\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.participants || [],
    ['id', 'name', 'age', 'gender', 'phone', 'rtRw', 'teamName']
  );

  // 3. registrations
  sql += buildTableDump(
    'registrations',
    `CREATE TABLE \`registrations\` (
  \`id\` varchar(64) NOT NULL,
  \`competitionId\` varchar(64) NOT NULL,
  \`participantId\` varchar(64) NOT NULL,
  \`regCode\` varchar(50) DEFAULT NULL,
  \`registeredAt\` varchar(100) DEFAULT NULL,
  \`status\` varchar(50) DEFAULT 'Ready',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.registrations || [],
    ['id', 'competitionId', 'participantId', 'regCode', 'registeredAt', 'status']
  );

  // 4. winners
  sql += buildTableDump(
    'winners',
    `CREATE TABLE \`winners\` (
  \`id\` varchar(64) NOT NULL,
  \`competitionId\` varchar(64) NOT NULL,
  \`rank\` int(11) NOT NULL,
  \`participantId\` varchar(64) NOT NULL,
  \`awardedAt\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.winners || [],
    ['id', 'competitionId', 'rank', 'participantId', 'awardedAt']
  );

  // 5. committees
  sql += buildTableDump(
    'committees',
    `CREATE TABLE \`committees\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`role\` varchar(100) DEFAULT NULL,
  \`section\` varchar(100) DEFAULT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`rtRw\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.committees || [],
    ['id', 'name', 'role', 'section', 'phone', 'rtRw']
  );

  // 6. doorprizes
  sql += buildTableDump(
    'doorprizes',
    `CREATE TABLE \`doorprizes\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`quantity\` int(11) DEFAULT 1,
  \`winnerParticipantId\` varchar(64) DEFAULT NULL,
  \`wonAt\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.doorprizes || [],
    ['id', 'name', 'quantity', 'winnerParticipantId', 'wonAt']
  );

  // 7. activity_logs
  sql += buildTableDump(
    'activity_logs',
    `CREATE TABLE \`activity_logs\` (
  \`id\` varchar(64) NOT NULL,
  \`action\` varchar(255) NOT NULL,
  \`detail\` text,
  \`timestamp\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    data.history || [],
    ['id', 'action', 'detail', 'timestamp']
  );

  sql += `/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
`;

  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dbName}.sql`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return dbName;
}
