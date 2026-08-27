const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:resourceId", authenticateToken, async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { message } = req.body;

        // Check whether resource exists and is available
        const resourceResult = await pool.query(
            `SELECT * FROM resources
             WHERE id = $1 AND status = 'AVAILABLE'`,
            [resourceId]
        );

        if (resourceResult.rows.length === 0) {
            return res.status(404).json({
                message: "Resource not found or not available"
            });
        }

        const resource = resourceResult.rows[0];

        // Donor cannot request their own resource
        if (resource.user_id === req.user.id) {
            return res.status(400).json({
                message: "You cannot request your own resource"
            });
        }

        // Check if user already requested this resource
        const existingRequest = await pool.query(
            `SELECT id FROM requests
             WHERE resource_id = $1
             AND requester_id = $2
             AND status = 'PENDING'`,
            [resourceId, req.user.id]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(400).json({
                message: "You already requested this resource"
            });
        }

        const result = await pool.query(
            `INSERT INTO requests
             (resource_id, requester_id, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [resourceId, req.user.id, message || null]
        );

        res.status(201).json({
            message: "Resource requested successfully",
            request: result.rows[0]
        });

    } catch (error) {
        console.error("Request creation error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.put("/:requestId/accept", authenticateToken, async (req, res) => {
    try {
        const { requestId } = req.params;

        const result = await pool.query(
            `SELECT 
                requests.*,
                resources.user_id AS donor_id
             FROM requests
             JOIN resources 
             ON requests.resource_id = resources.id
             WHERE requests.id = $1`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = result.rows[0];

        // Only the donor can accept the request
        if (request.donor_id !== req.user.id) {
            return res.status(403).json({
                message: "Only the donor can accept this request"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "This request has already been processed"
            });
        }

        const updatedRequest = await pool.query(
            `UPDATE requests
             SET status = 'ACCEPTED'
             WHERE id = $1
             RETURNING *`,
            [requestId]
        );

        // Mark resource as requested/accepted
        await pool.query(
            `UPDATE resources
             SET status = 'REQUESTED'
             WHERE id = $1`,
            [request.resource_id]
        );

        res.json({
            message: "Request accepted successfully",
            request: updatedRequest.rows[0]
        });

    } catch (error) {
        console.error("Accept request error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.put("/:requestId/reject", authenticateToken, async (req, res) => {
    try {
        const { requestId } = req.params;

        const result = await pool.query(
            `SELECT 
                requests.*,
                resources.user_id AS donor_id
             FROM requests
             JOIN resources 
             ON requests.resource_id = resources.id
             WHERE requests.id = $1`,
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = result.rows[0];

        if (request.donor_id !== req.user.id) {
            return res.status(403).json({
                message: "Only the donor can reject this request"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "This request has already been processed"
            });
        }

        const updatedRequest = await pool.query(
            `UPDATE requests
             SET status = 'REJECTED'
             WHERE id = $1
             RETURNING *`,
            [requestId]
        );

        res.json({
            message: "Request rejected successfully",
            request: updatedRequest.rows[0]
        });

    } catch (error) {
        console.error("Reject request error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/received", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                requests.*,
                resources.title,
                resources.category,
                resources.quantity,
                resources.unit,
                users.name AS requester_name
             FROM requests
             JOIN resources
             ON requests.resource_id = resources.id
             JOIN users
             ON requests.requester_id = users.id
             WHERE resources.user_id = $1
             ORDER BY requests.created_at DESC`,
            [req.user.id]
        );

        res.json({
            count: result.rows.length,
            requests: result.rows
        });

    } catch (error) {
        console.error(
            "Fetching received requests error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/received", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                requests.*,
                resources.title,
                resources.category,
                resources.quantity,
                resources.unit,
                users.name AS requester_name
             FROM requests
             JOIN resources
                ON requests.resource_id = resources.id
             JOIN users
                ON requests.requester_id = users.id
             WHERE resources.user_id = $1
             ORDER BY requests.created_at DESC`,
            [req.user.id]
        );

        res.json({
            count: result.rows.length,
            requests: result.rows
        });

    } catch (error) {
        console.error(
            "Fetching received requests error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.get("/my", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                requests.*,
                resources.title,
                resources.category,
                resources.quantity,
                resources.unit,
                users.name AS donor_name
             FROM requests
             JOIN resources
             ON requests.resource_id = resources.id
             JOIN users
             ON resources.user_id = users.id
             WHERE requests.requester_id = $1
             ORDER BY requests.created_at DESC`,
            [req.user.id]
        );

        res.json({
            count: result.rows.length,
            requests: result.rows
        });

    } catch (error) {
        console.error("Fetching my requests error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;