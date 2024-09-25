import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `PK_${table}_${columnsSnakeCase}`;
  }

  foreignKeyName(
    tableOrName: string | Table,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const rfTable = _referencedTablePath;
    const columnsSnakeCase = columnNames.join('_');

    return `FK_${table}_${rfTable}_${columnsSnakeCase}`;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    return `UQ_${key}`;
  }

  defaultConstraintName(
    tableOrName: Table | string,
    columnName: string,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${columnName}`;
    return `DF_${key}`;
  }

  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    let key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
    if (where) key += `_${where}`;

    return `IDX_${key}`;
  }

  checkConstraintName(
    tableOrName: Table | string,
    expression: string,
    isEnum?: boolean,
  ): string {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}_${expression}`;
    const name = `CHK_${key}`;
    return isEnum ? `${name}_ENUM` : name;
  }
}
