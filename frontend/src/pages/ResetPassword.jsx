import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!token) {
            setMessage("Invalid or missing reset token.");
            return;
        }

        if (!password || !confirmPassword) {
            setMessage("Please fill both password fields.");
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword(
                token,
                password
            );

            if (data.message) {
                setMessage(data.message);
            }

            if (
                data.message &&
                data.message
                    .toLowerCase()
                    .includes("success")
            ) {
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            setMessage(
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>
                    Reset Password
                </h1>

                <p>
                    Create a new password for
                    your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </button>

                </form>


                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}


                <p className="auth-link">

                    Remember your password?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default ResetPassword;