import db from './db.js';

const tableExists = async (tableName) => {
    const result = await db.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1) AS exists`,
        [tableName]
    );
    return result.rows[0]?.exists === true;
};

const DEFAULT_CATEGORIES = [
    {
        category_id: 1,
        name: 'Education',
        description: 'Projects focused on teaching, mentoring, and educational support for all ages.'
    },
    {
        category_id: 2,
        name: 'Environment',
        description: 'Conservation, cleanup, and sustainability initiatives to protect our planet.'
    },
    {
        category_id: 3,
        name: 'Health & Wellness',
        description: 'Healthcare services, mental health support, and wellness programs.'
    }
];

const getAllCategories = async () => {
    try {
        if (!(await tableExists('category'))) {
            return DEFAULT_CATEGORIES;
        }

        const query = `
            SELECT category_id, name, description
            FROM public.category
            ORDER BY name;
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Unable to load categories (DB unavailable):', error.message);
        return DEFAULT_CATEGORIES;
    }
};

export { getAllCategories };
