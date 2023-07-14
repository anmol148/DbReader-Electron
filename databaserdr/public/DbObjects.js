const Queries={
    QueryForDbList:`SELECT name,database_id
    FROM sys.databases
    WHERE database_id > 4;`,
    QueryForDashboard : `SELECT
database_id,DB_NAME(database_id) AS DatabaseName,
CONVERT(decimal(12, 2), SUM(size * 8.0 / 1024)) AS SpaceInMB
FROM
sys.master_files
WHERE
type = 0 
GROUP BY
database_id
ORDER BY
DatabaseName;`,
 fetchRecordlist: `DECLARE @startDate DATETIME = @datestart;
DECLARE @endDate DATETIME = @dateend;
DECLARE @databaseName NVARCHAR(128) = @database;
DECLARE @SQL NVARCHAR(MAX) = '';

IF @databaseName = ''
BEGIN
    CREATE TABLE #UpdatedObjectsRecALL (
        DatabaseName NVARCHAR(128),
        ObjectName NVARCHAR(128),
        ObjectType NVARCHAR(20),
        CreateDate NVARCHAR(128),
        ModifyDate NVARCHAR(128),
    );

    SELECT @SQL = @SQL + 'USE ' + QUOTENAME(name) + ';
        INSERT INTO #UpdatedObjectsRecALL (DatabaseName, ObjectName, ObjectType,CreateDate,ModifyDate)
        SELECT ''' + name + ''', name, type,create_date,modify_date
        FROM sys.objects
        WHERE type IN (''TR'',''SQ'',''FN'',''S'',''D'',''IT'',''SO'',''PK'',''P'',''U'',''UQ'',''V'',''IF'',''TF'',''FS'',''FT'',''PC'',''C'') AND
            modify_date BETWEEN ''' + CONVERT(NVARCHAR(50), @startDate, 121) + ''' AND ''' + CONVERT(NVARCHAR(50), @endDate, 121) + '''order by modify_date desc;'
    FROM sys.databases
    WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');

    EXEC sp_executesql @SQL;

    SELECT *
    FROM #UpdatedObjectsRecALL;
	DROP TABLE #UpdatedObjectsRecALL;
END
ELSE
BEGIN
    CREATE TABLE #UpdatedObjectsRec (
        DatabaseName NVARCHAR(128),
        ObjectName NVARCHAR(128),
        ObjectType NVARCHAR(20),
        CreateDate NVARCHAR(128),
        ModifyDate NVARCHAR(128),
    );

    SELECT @SQL = @SQL + 'USE ' + QUOTENAME(@databaseName) + ';
        INSERT INTO #UpdatedObjectsRec (DatabaseName, ObjectName, ObjectType,CreateDate,ModifyDate)
        SELECT ''' + @databaseName + ''', name, type,create_date,modify_date
        FROM sys.objects
        WHERE type IN (''TR'',''SQ'',''FN'',''S'',''D'',''IT'',''SO'',''PK'',''P'',''U'',''UQ'',''V'',''IF'',''TF'',''FS'',''FT'',''PC'',''C'') AND
            modify_date BETWEEN ''' + CONVERT(NVARCHAR(50), @startDate, 121) + ''' AND ''' + CONVERT(NVARCHAR(50), @endDate, 121) + '''order by modify_date desc;'
    FROM sys.databases
    WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');

    EXEC sp_executesql @SQL;

    SELECT *
    FROM #UpdatedObjectsRec;

    DROP TABLE #UpdatedObjectsRec;
END
`,
LastexecutionTime:`SELECT
OBJECT_NAME(ps.object_id) AS ObjectName,
CASE
    WHEN o.type = 'TR' THEN 'Trigger'
    WHEN o.type = 'P' THEN 'Procedure'
    WHEN o.type IN ('FN', 'IF', 'TF') THEN 'Function'
    WHEN o.type = 'X' THEN 'Extended Stored Procedure'
    WHEN o.type = 'V' THEN 'View'
    WHEN o.type = 'SN' THEN 'Synonym'
    WHEN o.type = 'UQ' THEN 'Unique Constraint'
    ELSE 'Other'
END AS ObjectType,
ps.last_execution_time AS LastExecutionTime
FROM
sys.dm_exec_procedure_stats ps
INNER JOIN
sys.objects o ON ps.object_id = o.object_id
WHERE
ps.database_id = DB_ID() -- Retrieves statistics for the current database
AND o.type IN ('TR', 'P', 'FN', 'IF', 'TF', 'X', 'V', 'SN', 'UQ')


`
} 
module.exports = {
    Queries,
  };