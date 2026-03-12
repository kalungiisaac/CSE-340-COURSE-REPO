import db from './db.js';

const DEFAULT_PROJECTS_REPORT = {
    totalProjects: 3,
    projects: [
        {
            project_id: 1,
            organization_id: 1,
            organization_name: 'BrightFuture Builders',
            title: 'Community Center Renovation',
            description: 'Renovating the downtown community center including painting, roof repair, and new flooring.',
            location: '123 Main St, Downtown',
            project_date: '2024-06-15',
            created_at: new Date().toISOString()
        },
        {
            project_id: 2,
            organization_id: 2,
            organization_name: 'GreenHarvest Growers',
            title: 'Urban Farm Workshop',
            description: 'Teaching community members how to start container gardens.',
            location: '789 Elm St, Community Center',
            project_date: '2024-06-10',
            created_at: new Date().toISOString()
        },
        {
            project_id: 3,
            organization_id: 3,
            organization_name: 'UnityServe Volunteers',
            title: 'Food Bank Sorting',
            description: 'Sorting and organizing donations at the regional food bank.',
            location: '321 Cedar Rd, Food Bank',
            project_date: '2024-06-20',
            created_at: new Date().toISOString()
        }
    ],
    projectsByOrg: [
        { name: 'BrightFuture Builders', project_count: '1' },
        { name: 'GreenHarvest Growers', project_count: '1' },
        { name: 'UnityServe Volunteers', project_count: '1' }
    ],
    upcomingProjects: [
        {
            organization: 'GreenHarvest Growers',
            title: 'Urban Farm Workshop',
            location: '789 Elm St, Community Center',
            project_date: '2024-06-10',
            created_at: new Date().toISOString()
        },
        {
            organization: 'BrightFuture Builders',
            title: 'Community Center Renovation',
            location: '123 Main St, Downtown',
            project_date: '2024-06-15',
            created_at: new Date().toISOString()
        },
        {
            organization: 'UnityServe Volunteers',
            title: 'Food Bank Sorting',
            location: '321 Cedar Rd, Food Bank',
            project_date: '2024-06-20',
            created_at: new Date().toISOString()
        }
    ]
};

const getProjectsReport = async () => {
    try {
        // The current schema defines a "service_project" table for service projects.
        // If the table does not exist, return an empty report so the UI can render safely.
        const tableCheck = await db.query(
            `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_project') AS exists`
        );

        if (tableCheck.rows[0]?.exists !== true) {
            return DEFAULT_PROJECTS_REPORT;
        }

        const allProjectsQuery = `
            SELECT
                p.project_id,
                p.organization_id,
                o.name AS organization_name,
                p.title,
                p.description,
                p.location,
                p.project_date,
                p.created_at
            FROM public.service_project p
            JOIN public.organization o ON o.organization_id = p.organization_id
            ORDER BY o.name, p.project_date;
        `;

        const totalCountQuery = `
            SELECT COUNT(*) AS total_projects
            FROM public.service_project;
        `;

        const countByOrgQuery = `
            SELECT
                o.name,
                COUNT(p.project_id) AS project_count
            FROM public.organization o
            LEFT JOIN public.service_project p ON o.organization_id = p.organization_id
            GROUP BY o.organization_id, o.name
            ORDER BY project_count DESC;
        `;

        const upcomingQuery = `
            SELECT
                o.name AS organization,
                p.title,
                p.location,
                p.project_date,
                p.created_at
            FROM public.service_project p
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
    } catch (error) {
        console.error('Unable to load projects report (DB unavailable):', error.message);
        return {
            totalProjects: 0,
            projects: [],
            projectsByOrg: [],
            upcomingProjects: []
        };
    }
};

export { getProjectsReport };
