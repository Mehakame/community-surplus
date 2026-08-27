const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            quantity,
            unit,
            expiry_date,
            latitude,
            longitude
        } = req.body;

        if (!title || !category || !quantity || !unit) {
            return res.status(400).json({
                message: "Title, category, quantity and unit are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO resources
            (user_id, title, description, category, quantity, unit,
             expiry_date, latitude, longitude)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                req.user.id,
                title,
                description,
                category,
                quantity,
                unit,
                expiry_date || null,
                latitude || null,
                longitude || null
            ]
        );

        res.status(201).json({
            message: "Surplus resource posted successfully",
            resource: result.rows[0]
        });

    } catch (error) {
        console.error("Resource creation error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        let query = `
            SELECT 
                resources.*,
                users.name AS donor_name
            FROM resources
            JOIN users ON resources.user_id = users.id
            WHERE resources.status = 'AVAILABLE'
        `;

        const values = [];

        if (category) {
            values.push(category);

            query += ` AND resources.category = $${values.length}`;
        }

        query += ` ORDER BY resources.created_at DESC`;

        const result = await pool.query(query, values);

        res.json({
            count: result.rows.length,
            resources: result.rows
        });

    } catch (error) {
        console.error("Fetching resources error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/my/count", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS count
             FROM resources
             WHERE user_id = $1`,
            [req.user.id]
        );

        res.json({
            count: Number(result.rows[0].count)
        });

    } catch (error) {
        console.error(
            "My resources count error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/nearby", authenticateToken, async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;

        // Check values
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const lat = Number(latitude);
        const lon = Number(longitude);
        const distance = Number(radius);

        // Validate values
        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            !Number.isFinite(distance)
        ) {
            return res.status(400).json({
                message: "Invalid location values"
            });
        }

        // Validate latitude
        if (lat < -90 || lat > 90) {
            return res.status(400).json({
                message: "Invalid latitude"
            });
        }

        // Validate longitude
        if (lon < -180 || lon > 180) {
            return res.status(400).json({
                message: "Invalid longitude"
            });
        }

        // Radius must be positive
        if (distance <= 0 || distance > 100) {
            return res.status(400).json({
                message: "Radius must be between 1 and 100 km"
            });
        }

        const result = await pool.query(
            `
            SELECT
                resources.*,

                (
                    6371 * acos(
                        LEAST(
                            1,
                            GREATEST(
                                -1,

                                cos(radians($1))
                                *
                                cos(radians(latitude))
                                *
                                cos(
                                    radians(longitude)
                                    - radians($2)
                                )

                                +

                                sin(radians($1))
                                *
                                sin(radians(latitude))
                            )
                        )
                    )
                ) AS distance_km

            FROM resources

            WHERE status = 'AVAILABLE'

              AND latitude IS NOT NULL
              AND longitude IS NOT NULL

            ORDER BY distance_km ASC
            `,
            [lat, lon]
        );

        // Filter by radius
        const nearbyResources = result.rows.filter(
            (resource) =>
                Number(resource.distance_km) <= distance
        );

        res.json({
            count: nearbyResources.length,
            resources: nearbyResources
        });

    } catch (error) {

        console.error(
            "Nearby resources error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                resources.*,
                users.name AS donor_name,
                users.phone AS donor_phone
             FROM resources
             JOIN users ON resources.user_id = users.id
             WHERE resources.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        res.json({
            resource: result.rows[0]
        });

    } catch (error) {
        console.error("Fetching resource error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/my/resources", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM resources
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({
            count: result.rows.length,
            resources: result.rows
        });

    } catch (error) {
        console.error("Fetching my resources error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;