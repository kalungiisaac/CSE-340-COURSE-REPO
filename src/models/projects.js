import db from './db.js';

const tableExists = async (tableName) => {
    const result = await db.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1) AS exists`,
        [tableName]
    );
    return result.rows[0]?.exists === true;
};

const columnExists = async (tableName, columnName) => {
    const result = await db.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2) AS exists`,
        [tableName, columnName]
    );
    return result.rows[0]?.exists === true;
};

const getProjectsReport = async () => {
    // Prefer the user-defined service_project table if it exists.
    const sourceTable = (await tableExists('service_project')) ? 'service_project' : 'projects';

    if (!(await tableExists(sourceTable))) {
        return {
            totalProjects: 0,
            projects: [],
            projectsByOrg: [],
            upcomingProjects: []
        };
    }

    const hasLocation = await columnExists(sourceTable, 'location');

    const locationSelect = hasLocation ? 'p.location' : 'NULL AS location';

    const allProjectsQuery = `
        SELECT
            o.name AS organization_name,
            p.title,
            p.description,
            ${locationSelect},
            p.project_date
        FROM public.${sourceTable} p
        JOIN public.organization o ON o.organization_id = p.organization_id
        ORDER BY o.name, p.project_date;
    `;

    const totalCountQuery = `
        SELECT COUNT(*) AS total_projects
        FROM public.${sourceTable};
    `;

    const countByOrgQuery = `
        SELECT
            o.name,
            COUNT(p.project_id) AS project_count
        FROM public.organization o
        LEFT JOIN public.${sourceTable} p ON o.organization_id = p.organization_id
        GROUP BY o.organization_id, o.name
        ORDER BY project_count DESC;
    `;

    const upcomingQuery = `
        SELECT
            o.name AS organization,
            p.title,
            ${locationSelect},
            p.project_date
        FROM public.${sourceTable} p
        JOIN public.organization o ON o.organization_id = p.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date
        LIMIT 10;
    `;

    const [totalRes, allRes, countRes, upcomingRes] = await Promise.all([
        db.query(totalCountQuery),
        db.query(allProjectsQuery),
        db.query(countByOrgQuery),
        db.query(upcomingQuery)
    ]);

    return {
        totalProjects: Number(totalRes.rows[0]?.total_projects ?? 0),
        projects: allRes.rows,
        projectsByOrg: countRes.rows,
        upcomingProjects: upcomingRes.rows
    };
};

export { getProjectsReport };
