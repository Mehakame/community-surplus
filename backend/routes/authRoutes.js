const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
             (name, email, password, phone)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, phone, role`,
            [
                name,
                email,
                hashedPassword,
                phone
            ]
        );

        res.status(201).json({
            message:
                "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// MY PROFILE
// =========================

router.get(
    "/profile",
    authenticateToken,
    async (req, res) => {
        try {

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    phone,
                    role
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                user: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            res.status(500).json({
                message: "Server error"
            });
        }
    }
);


// =========================
// FORGOT PASSWORD
// =========================

router.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    message:
                        "Email is required"
                });
            }

            const result = await pool.query(
                `SELECT id
                 FROM users
                 WHERE email = $1`,
                [email]
            );

            /*
             * Security:
             * Don't reveal whether the email
             * exists or not.
             */

            if (result.rows.length === 0) {
                return res.json({
                    message:
                        "If this email is registered, a password reset request has been created."
                });
            }

            const userId =
                result.rows[0].id;

            /*
             * Generate a random reset token.
             */

            const crypto =
                require("crypto");

            const resetToken =
                crypto.randomBytes(32)
                    .toString("hex");

            /*
             * Token valid for 15 minutes.
             */

            const expiry =
                new Date(
                    Date.now() +
                    15 * 60 * 1000
                );

            await pool.query(
                `UPDATE users
                 SET reset_token = $1,
                     reset_token_expiry = $2
                 WHERE id = $3`,
                [
                    resetToken,
                    expiry,
                    userId
                ]
            );

            /*
             * Development mode:
             * We return the token so you can
             * test the complete reset flow.
             *
             * In production this token should
             * be sent through email instead.
             */

            console.log(
                "PASSWORD RESET TOKEN:",
                resetToken
            );

            res.json({
                message:
                    "Password reset request created.",
                resetToken: resetToken
            });

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });
        }
    }
);


// =========================
// RESET PASSWORD
// =========================

router.post(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                token,
                password
            } = req.body;

            if (!token || !password) {
                return res.status(400).json({
                    message:
                        "Token and new password are required"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });
            }

            const result = await pool.query(
                `SELECT id
                 FROM users
                 WHERE reset_token = $1
                 AND reset_token_expiry > NOW()`,
                [token]
            );

            if (result.rows.length === 0) {
                return res.status(400).json({
                    message:
                        "Invalid or expired reset token"
                });
            }

            const userId =
                result.rows[0].id;

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            await pool.query(
                `UPDATE users
                 SET password = $1,
                     reset_token = NULL,
                     reset_token_expiry = NULL
                 WHERE id = $2`,
                [
                    hashedPassword,
                    userId
                ]
            );

            res.json({
                message:
                    "Password reset successfully. You can now login."
            });

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });
        }
    }
);


module.exports = router;