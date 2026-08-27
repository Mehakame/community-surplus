import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setResetToken("");

        if (!email) {
            setMessage("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const data = await forgotPassword(email);

            setMessage(
                data.message ||
                "Password reset request created."
            );

            // Development testing
            if (data.resetToken) {
                setResetToken(data.resetToken);
            }

        } catch (error) {
            console.error(
                "Forgot password error:",
                error
            );

            setMessage(
                "Unable to process request."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        navigate(
            `/reset-password?token=${resetToken}`
        );
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>
                    Forgot Password
                </h1>

                <p>
                    Enter your registered email
                    to reset your password.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Reset Password"}
                    </button>

                </form>


                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}


                {resetToken && (
                    <div className="reset-token-box">

                        <p>
                            Development reset token
                            generated.
                        </p>

                        <button
                            type="button"
                            onClick={handleReset}
                        >
                            Continue to Reset Password
                        </button>

                    </div>
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

export default ForgotPassword;