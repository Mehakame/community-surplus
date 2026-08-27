import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResources } from "../services/api";

function Home() {
    const [resources, setResources] = useState([]);
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadResources();
    }, [category]);

    const loadResources = async () => {
        setLoading(true);
        setMessage("");

        try {
            const data = await getResources(category);

            setResources(data.resources || []);
        } catch (error) {
            console.error("Loading resources error:", error);

            setMessage(
                "Unable to load resources. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter((resource) => {
        const text = `
            ${resource.title || ""}
            ${resource.description || ""}
            ${resource.category || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    return (
        <div className="home-page">

            {/* =========================
                HERO
            ========================= */}

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-badge">
                        🌱 Share • Reuse • Support
                    </span>

                    <h1>
                        Turn Surplus Into
                        <span> Community Support</span>
                    </h1>

                    <p>
                        Share extra food, clothes,
                        books and household items
                        with people around your
                        local community.
                    </p>

                    <div className="hero-actions">

                        {token ? (
                            <Link
                                to="/post-resource"
                                className="btn"
                            >
                                + Share Surplus
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="btn"
                            >
                                Get Started
                            </Link>
                        )}

                        <Link
                            to="/nearby"
                            className="btn btn-secondary"
                        >
                            📍 Find Nearby
                        </Link>

                    </div>

                </div>

            </section>


            {/* =========================
                RESOURCE SECTION
            ========================= */}

            <section className="resources-section">

                <div className="section-header">

                    <div>
                        <span className="section-label">
                            COMMUNITY RESOURCES
                        </span>

                        <h2>
                            Available Resources
                        </h2>

                        <p>
                            Discover useful surplus
                            resources shared by your
                            community.
                        </p>
                    </div>

                    <div className="resource-count">
                        <strong>
                            {filteredResources.length}
                        </strong>

                        <span>
                            Resources
                        </span>
                    </div>

                </div>


                {/* =========================
                    SEARCH & FILTER
                ========================= */}

                <div className="resource-toolbar">

                    <div className="search-box">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="filter-box">

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >

                            <option value="">
                                All Categories
                            </option>

                            <option value="Food">
                                Food
                            </option>

                            <option value="Clothes">
                                Clothes
                            </option>

                            <option value="Household">
                                Household
                            </option>

                            <option value="Books">
                                Books
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (
                    <div className="empty-state">

                        <div className="loading-spinner">
                            ⏳
                        </div>

                        <h3>
                            Loading resources...
                        </h3>

                        <p>
                            Please wait while we find
                            available resources.
                        </p>

                    </div>
                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && message && (
                    <div className="error-message">
                        {message}
                    </div>
                )}


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {!loading &&
                    !message &&
                    filteredResources.length === 0 && (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📦
                        </div>

                        <h3>
                            No resources found
                        </h3>

                        <p>
                            Try another search term
                            or category.
                        </p>

                        {(search || category) && (
                            <button
                                className="btn"
                                onClick={() => {
                                    setSearch("");
                                    setCategory("");
                                }}
                            >
                                Clear Filters
                            </button>
                        )}

                    </div>
                )}


                {/* =========================
                    RESOURCE CARDS
                ========================= */}

                {!loading &&
                    filteredResources.length > 0 && (

                    <div className="resource-grid">

                        {filteredResources.map(
                            (resource) => (

                            <div
                                className="resource-card"
                                key={resource.id}
                            >

                                <div className="resource-card-top">

                                    <span className="resource-category">
                                        {resource.category}
                                    </span>

                                    <span
                                        className={
                                            resource.status ===
                                            "AVAILABLE"
                                                ? "status-available"
                                                : "status-unavailable"
                                        }
                                    >
                                        {resource.status}
                                    </span>

                                </div>


                                <h3>
                                    {resource.title}
                                </h3>


                                <p className="resource-description">
                                    {resource.description ||
                                        "No description provided."}
                                </p>


                                <div className="resource-meta">

                                    <div>
                                        <span>
                                            Quantity
                                        </span>

                                        <strong>
                                            {resource.quantity}{" "}
                                            {resource.unit}
                                        </strong>
                                    </div>

                                </div>


                                <Link
                                    to={`/resources/${resource.id}`}
                                    className="btn resource-button"
                                >
                                    View Details →
                                </Link>

                            </div>
                        ))}

                    </div>
                )}


            </section>


            {/* =========================
                CTA
            ========================= */}

            <section className="home-cta">

                <div>

                    <span>
                        🌱 MAKE A DIFFERENCE
                    </span>

                    <h2>
                        Have something extra?
                    </h2>

                    <p>
                        Someone in your community
                        might need it.
                    </p>

                </div>

                <Link
                    to={
                        token
                            ? "/post-resource"
                            : "/register"
                    }
                    className="btn"
                >
                    {token
                        ? "Share a Resource"
                        : "Join Community"}
                </Link>

            </section>

        </div>
    );
}

export default Home;