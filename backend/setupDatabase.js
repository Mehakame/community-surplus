const pool = require("./db");

async function setupDatabase() {
    try {
        console.log("Creating database tables...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(50) DEFAULT 'user',
                reset_token TEXT,
                reset_token_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS resources (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100) NOT NULL,
                quantity NUMERIC NOT NULL,
                unit VARCHAR(50) NOT NULL,

                expiry_date DATE,
                latitude DOUBLE PRECISION,
                longitude DOUBLE PRECISION,

                status VARCHAR(50) DEFAULT 'AVAILABLE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,

                resource_id INTEGER NOT NULL
                    REFERENCES resources(id)
                    ON DELETE CASCADE,

                requester_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                message TEXT,
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ All tables created successfully!");

    } catch (error) {
        console.error("❌ Database setup error:", error);
    } finally {
        await pool.end();
    }
}

setupDatabase();