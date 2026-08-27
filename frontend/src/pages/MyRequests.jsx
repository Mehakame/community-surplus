import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests } from "../services/api";

function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await getMyRequests();

            setRequests(data.requests || []);
        } catch (error) {
            console.error(
                "My requests error:",
                error
            );

            setMessage(
                "Unable to load your requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "ACCEPTED") {
            return "status-accepted";
        }

        if (status === "REJECTED") {
            return "status-rejected";
        }

        return "status-pending";
    };

    if (loading) {
        return (
            <div className="dashboard">
                <h1>My Requests</h1>
                <p>Loading your requests...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>My Requests</h1>

                    <p>
                        Track the resources you
                        have requested.
                    </p>
                </div>

                <Link
                    to="/"
                    className="btn"
                >
                    Find Resources
                </Link>
            </div>

            {message && (
                <div className="error-message">
                    {message}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="dashboard-section">
                    <h2>
                        No Requests Yet
                    </h2>

                    <p>
                        You haven't requested any
                        resources yet.
                    </p>

                    <Link
                        to="/"
                        className="btn"
                    >
                        Browse Resources
                    </Link>
                </div>
            ) : (
                <div className="request-list">

                    {requests.map((request) => (
                        <div
                            className="request-card"
                            key={request.id}
                        >

                            <span className="resource-category">
                                {request.category}
                            </span>

                            <h3>
                                {request.title}
                            </h3>

                            <p>
                                <strong>
                                    Quantity:
                                </strong>{" "}
                                {request.quantity}{" "}
                                {request.unit}
                            </p>

                            <p>
                                <strong>
                                    Donor:
                                </strong>{" "}
                                {request.donor_name ||
                                    "Community Member"}
                            </p>

                            {request.message && (
                                <p>
                                    <strong>
                                        My Message:
                                    </strong>{" "}
                                    {request.message}
                                </p>
                            )}

                            <p>
                                <strong>
                                    Requested:
                                </strong>{" "}
                                {request.created_at
                                    ? new Date(
                                          request.created_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}

                                <span
                                    className={getStatusClass(
                                        request.status
                                    )}
                                >
                                    {request.status}
                                </span>
                            </p>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyRequests;