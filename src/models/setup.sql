-- =====================================================
-- DATABASE SETUP SCRIPT
-- =====================================================
-- This script creates tables and inserts sample data for:
-- 1. Organizations
-- 2. Service Projects
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (Clean start)
-- =====================================================
-- Drop tables in correct order (respect foreign key dependencies)
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS organization;

-- =====================================================
-- CREATE ORGANIZATION TABLE
-- =====================================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE SERVICE PROJECT TABLE
-- =====================================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Foreign key constraint to ensure data integrity
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_project_organization ON service_project(organization_id);
CREATE INDEX idx_project_date ON service_project(project_date);

-- =====================================================
-- INSERT SAMPLE ORGANIZATIONS
-- =====================================================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- =====================================================
-- INSERT SAMPLE SERVICE PROJECTS
-- =====================================================

-- For Organization 1 (BrightFuture Builders) - 5 projects
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(1, 'Community Center Renovation', 'Renovating the downtown community center including painting, roof repair, and new flooring.', '123 Main St, Downtown', '2024-06-15'),
(1, 'Park Cleanup Initiative', 'Cleaning and beautifying Riverside Park with new benches and trash cans.', 'Riverside Park', '2024-07-22'),
(1, 'School Library Makeover', 'Painting and furnishing the local elementary school library.', 'Jefferson Elementary', '2024-08-10'),
(1, 'Senior Center Garden', 'Creating a accessible garden space at the senior citizens center.', '456 Oak Ave, Senior Center', '2024-09-05'),
(1, 'Homeless Shelter Repairs', 'Fixing plumbing and electrical issues at Hope Shelter.', '789 Pine St, Shelter', '2024-10-20');

-- For Organization 2 (GreenHarvest Growers) - 5 projects
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(2, 'Urban Farm Workshop', 'Teaching community members how to start container gardens.', '789 Elm St, Community Center', '2024-06-10'),
(2, 'School Garden Installation', 'Building raised garden beds at Washington Middle School.', 'Washington Middle School', '2024-07-15'),
(2, 'Farmers Market Setup', 'Helping set up and run the weekly farmers market.', 'Market Square', '2024-08-05'),
(2, 'Composting Workshop', 'Educational workshop on home composting techniques.', 'Green Space Park', '2024-09-12'),
(2, 'Seed Distribution Day', 'Distributing free vegetable seeds to low-income families.', 'Various Locations', '2024-10-08');

-- For Organization 3 (UnityServe Volunteers) - 5 projects
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(3, 'Food Bank Sorting', 'Sorting and organizing donations at the regional food bank.', '321 Cedar Rd, Food Bank', '2024-06-20'),
(3, 'Elderly Tech Support', 'Teaching seniors how to use smartphones and tablets.', 'Golden Age Center', '2024-07-25'),
(3, 'Blood Drive Coordination', 'Organizing volunteers for the annual blood drive.', 'City Convention Center', '2024-08-18'),
(3, 'Winter Coat Drive', 'Collecting and distributing coats to those in need.', 'Community Church', '2024-09-30'),
(3, 'Holiday Meal Preparation', 'Preparing and serving meals on Christmas Day.', 'Hope Kitchen', '2024-12-25');

-- =====================================================
-- ADDITIONAL PROJECTS (5 moRE)
-- =====================================================
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(1, 'Youth Mentorship Program', 'Weekly mentoring sessions for at-risk youth providing guidance and academic support.', 'Youth Center, 555 Cedar St', '2024-11-05'),
(2, 'Community Orchard Planting', 'Planting 50 fruit trees in the community orchard for future harvests.', 'Orchard Park, 777 Maple Ave', '2024-11-12'),
(3, 'Disaster Relief Training', 'Training volunteers in emergency response and first aid procedures.', 'Fire Station #2, 444 Oak St', '2024-11-20'),
(1, 'Housing Rehabilitation', 'Repairing and painting homes for low-income elderly residents.', 'Various Locations, East Side', '2024-12-01'),
(2, 'Harvest Festival', 'Organizing the annual harvest celebration with food and activities.', 'Fairgrounds, 888 Expo Blvd', '2024-10-15');

-- =====================================================
-- VERIFY DATA
-- =====================================================



-- =====================================================
-- HELPFUL QUERIES FOR MY APPLICATION
-- =====================================================

/*
-- Get all projects for a specific organization
SELECT * FROM service_project WHERE organization_id = 1;

-- Get upcoming projects (future dates)
SELECT * FROM service_project WHERE project_date >= CURRENT_DATE ORDER BY project_date;

-- Get projects in a date range
SELECT * FROM service_project 
WHERE project_date BETWEEN '2024-06-01' AND '2024-08-31'
ORDER BY project_date;

-- Search projects by location
SELECT * FROM service_project WHERE location LIKE '%Park%';
*/


