import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");

    // Close mobile menu
    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMenuOpen(false);

        navigate("/login");
    };

    return (
        <nav className="navbar">

            {/* =========================
                MOBILE MENU BUTTON
            ========================= */}

            <button
                className="mobile-menu-button"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
            >
                {menuOpen ? "✕" : "☰"}
            </button>


            {/* =========================
                LOGO
            ========================= */}

            <Link
                to="/"
                className="navbar-logo"
                onClick={closeMenu}
            >
                🌱 Community Surplus
            </Link>


            {/* =========================
                DESKTOP NAVIGATION
            ========================= */}

            <div className="navbar-links desktop-navbar">

                <Link to="/">
                    Home
                </Link>

                {token ? (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/nearby">
                            Nearby
                        </Link>

                        <Link to="/my-resources">
                            My Resources
                        </Link>

                        <Link to="/post-resource">
                            Share Resource
                        </Link>

                        <Link to="/my-requests">
                            My Requests
                        </Link>

                        <Link to="/requests">
                            Requests
                        </Link>

                        <Link to="/profile">
                            My Profile
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            type="button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>


            {/* =========================
                MOBILE NAVIGATION
            ========================= */}

            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="mobile-navbar"
                >

                    {/* Home */}

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        🏠 Home
                    </Link>


                    {token ? (
                        <>

                            {/* Dashboard */}

                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                            >
                                📊 Dashboard
                            </Link>


                            {/* Nearby */}

                            <Link
                                to="/nearby"
                                onClick={closeMenu}
                            >
                                📍 Nearby
                            </Link>


                            {/* My Resources */}

                            <Link
                                to="/my-resources"
                                onClick={closeMenu}
                            >
                                📦 My Resources
                            </Link>


                            {/* Share Resource */}

                            <Link
                                to="/post-resource"
                                onClick={closeMenu}
                            >
                                ➕ Share Resource
                            </Link>


                            {/* My Requests */}

                            <Link
                                to="/my-requests"
                                onClick={closeMenu}
                            >
                                📩 My Requests
                            </Link>


                            {/* Received Requests */}

                            <Link
                                to="/requests"
                                onClick={closeMenu}
                            >
                                📋 Requests
                            </Link>


                            {/* Profile */}

                            <Link
                                to="/profile"
                                onClick={closeMenu}
                            >
                                👤 My Profile
                            </Link>


                            {/* Logout */}

                            <button
                                onClick={handleLogout}
                                className="mobile-logout"
                                type="button"
                            >
                                🚪 Logout
                            </button>

                        </>
                    ) : (
                        <>

                            {/* Login */}

                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                🔑 Login
                            </Link>


                            {/* Register */}

                            <Link
                                to="/register"
                                onClick={closeMenu}
                            >
                                📝 Register
                            </Link>

                        </>
                    )}

                </div>
            )}

        </nav>
    );
}

export default Navbar;