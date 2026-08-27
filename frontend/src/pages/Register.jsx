import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.phone
        ) {
            setMessage("Please fill all fields.");
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser(form);

            if (data.message) {
                setMessage(data.message);
            }

            // Registration successful
            if (
                data.message &&
                (
                    data.message.toLowerCase().includes("success") ||
                    data.message.toLowerCase().includes("registered")
                )
            ) {
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setMessage(
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>
                    Create Account
                </h1>

                <p>
                    Join the Community Surplus
                    community.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Name */}

                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Email */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Phone */}

                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>


                {/* Message */}

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}


                {/* Login Link */}

                <p className="auth-link">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;