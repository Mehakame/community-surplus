import { useState } from "react";
import { Link } from "react-router-dom";
import { getNearbyResources } from "../services/api";

function NearbyResources() {
    const [resources, setResources] = useState([]);
    const [radius, setRadius] = useState(10);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const findNearbyResources = () => {
        // Check browser location support
        if (!navigator.geolocation) {
            setMessage(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setLoading(true);
        setMessage("");
        setResources([]);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Get current location
                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    console.log(
                        "Current latitude:",
                        latitude
                    );

                    console.log(
                        "Current longitude:",
                        longitude
                    );

                    console.log(
                        "Search radius:",
                        radius
                    );

                    // Call backend API
                    const data =
                        await getNearbyResources(
                            latitude,
                            longitude,
                            radius
                        );

                    // Check API response
                    console.log(
                        "Nearby API response:",
                        data
                    );

                    // Safely set resources
                    if (
                        data &&
                        Array.isArray(data.resources)
                    ) {
                        setResources(
                            data.resources
                        );

                        if (
                            data.resources.length === 0
                        ) {
                            setMessage(
                                "No resources found nearby."
                            );
                        } else {
                            setMessage(
                                `${data.resources.length} resource(s) found nearby.`
                            );
                        }
                    } else {
                        setResources([]);

                        setMessage(
                            "No resources found nearby."
                        );
                    }

                } catch (error) {
                    console.error(
                        "Nearby resources error:",
                        error
                    );

                    setResources([]);

                    setMessage(
                        "Unable to find nearby resources."
                    );
                } finally {
                    setLoading(false);
                }
            },

            // Location error
            (error) => {
                console.error(
                    "Location error:",
                    error
                );

                setLoading(false);

                setResources([]);

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    setMessage(
                        "Location permission denied. Please allow location access."
                    );
                } else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    setMessage(
                        "Your location is currently unavailable."
                    );
                } else if (
                    error.code ===
                    error.TIMEOUT
                ) {
                    setMessage(
                        "Location request timed out. Please try again."
                    );
                } else {
                    setMessage(
                        "Unable to get your location."
                    );
                }
            },

            // Location options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="dashboard">

            {/* =========================
                HEADER
            ========================== */}

            <div className="dashboard-header">

                <div>
                    <h1>
                         Nearby Resources
                    </h1>

                    <p>
                        Find surplus resources
                        available near you.
                    </p>
                </div>

            </div>


            {/* =========================
                LOCATION SEARCH
            ========================== */}

            <div className="dashboard-section">

                <h2>
                    Find Resources Near Me
                </h2>

                <p>
                    Select how far you want to
                    search for available resources.
                </p>


                {/* Radius */}

                <div className="form-group">

                    <label htmlFor="radius">
                        Search Radius
                    </label>

                    <select
                        id="radius"
                        value={radius}
                        onChange={(e) =>
                            setRadius(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                    >

                        <option value={1}>
                            1 km
                        </option>

                        <option value={5}>
                            5 km
                        </option>

                        <option value={10}>
                            10 km
                        </option>

                        <option value={25}>
                            25 km
                        </option>

                        <option value={50}>
                            50 km
                        </option>

                    </select>

                </div>


                {/* Find Button */}

                <button
                    onClick={findNearbyResources}
                    disabled={loading}
                >
                    {loading
                        ? "Finding..."
                        : "📍 Find Nearby Resources"}
                </button>

            </div>


            {/* =========================
                MESSAGE
            ========================== */}

            {message && (
                <div
                    className={
                        resources.length > 0
                            ? "success-message"
                            : "error-message"
                    }
                >
                    {message}
                </div>
            )}


            {/* =========================
                RESULTS
            ========================== */}

            {resources.length > 0 && (

                <div className="dashboard-section">

                    <h2>
                        Available Near You
                    </h2>

                    <div className="resource-grid">

                        {resources.map(
                            (resource) => (

                                <div
                                    className="resource-card"
                                    key={resource.id}
                                >

                                    {/* Category */}

                                    <span className="resource-category">
                                        {resource.category ||
                                            "Other"}
                                    </span>


                                    {/* Title */}

                                    <h3>
                                        {resource.title}
                                    </h3>


                                    {/* Description */}

                                    <p>
                                        {resource.description ||
                                            "No description available."}
                                    </p>


                                    {/* Quantity */}

                                    <p>
                                        <strong>
                                            Quantity:
                                        </strong>{" "}

                                        {resource.quantity}

                                        {" "}

                                        {resource.unit}
                                    </p>


                                    {/* Status */}

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {resource.status}
                                    </p>


                                    {/* Distance */}

                                    <p className="resource-distance">

                                        📍{" "}

                                        {Number(
                                            resource.distance_km
                                        ).toFixed(2)}

                                        {" "}km away

                                    </p>


                                    {/* Details */}

                                    <Link
                                        to={`/resources/${resource.id}`}
                                        className="btn"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* =========================
                BACK BUTTON
            ========================== */}

            <div className="dashboard-section">

                <Link
                    to="/"
                    className="btn"
                >
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default NearbyResources;