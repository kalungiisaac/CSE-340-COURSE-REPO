import db from './db.js';

const DEFAULT_ORGANIZATIONS = [
    {
        organization_id: 1,
        name: 'BrightFuture Builders',
        description: 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        contact_email: 'info@brightfuturebuilders.org',
        logo_filename: 'brightfuture-logo.png'
    },
    {
        organization_id: 2,
        name: 'GreenHarvest Growers',
        description: 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        contact_email: 'contact@greenharvest.org',
        logo_filename: 'greenharvest-logo.png'
    },
    {
        organization_id: 3,
        name: 'UnityServe Volunteers',
        description: 'A volunteer coordination group supporting local charities and service initiatives.',
        contact_email: 'hello@unityserve.org',
        logo_filename: 'unityserve-logo.png'
    }
];

const getAllOrganizations = async () => {
    try {
        const query = `
            SELECT organization_id, name, description, contact_email, logo_filename
            FROM public.organization;
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Unable to load organizations (DB unavailable):', error.message);
        return DEFAULT_ORGANIZATIONS;
    }
};

export { getAllOrganizations };
