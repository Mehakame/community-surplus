import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyResources } from "../services/api";

function MyResources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const data = await getMyResources();

            setResources(data.resources || []);
        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to load your resources."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "AVAILABLE") {
            return "status-accepted";
        }

        if (status === "REQUESTED") {
            return "status-pending";
        }

        return "status-rejected";
    };

    if (loading) {
        return (
            <div className="dashboard">
                <h1>My Resources</h1>
                <p>Loading your resources...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>
                    <h1> My Resources</h1>

                    <p>
                        Manage the resources you
                        have shared with the community.
                    </p>
                </div>

                <Link
                    to="/post-resource"
                    className="btn"
                >
                    + Share Resource
                </Link>

            </div>

            {message && (
                <div className="error-message">
                    {message}
                </div>
            )}

            {resources.length === 0 ? (

                <div className="dashboard-section">

                    <h2>
                        No Resources Yet
                    </h2>

                    <p>
                        You haven't shared any
                        resources yet.
                    </p>

                    <Link
                        to="/post-resource"
                        className="btn"
                    >
                        Share Your First Resource
                    </Link>

                </div>

            ) : (

                <div className="resource-grid">

                    {resources.map(
                        (resource) => (

                            <div
                                className="resource-card"
                                key={resource.id}
                            >

                                <span className="resource-category">
                                    {resource.category ||
                                        "Other"}
                                </span>

                                <h3>
                                    {resource.title}
                                </h3>

                                <p>
                                    {resource.description ||
                                        "No description available."}
                                </p>

                                <p>
                                    <strong>
                                        Quantity:
                                    </strong>{" "}
                                    {resource.quantity}{" "}
                                    {resource.unit}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}

                                    <span
                                        className={getStatusClass(
                                            resource.status
                                        )}
                                    >
                                        {resource.status}
                                    </span>
                                </p>

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

            )}

        </div>
    );
}

export default MyResources;