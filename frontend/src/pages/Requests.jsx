import { useEffect, useState } from "react";
import {
    getResourceRequests,
    updateRequestStatus
} from "../services/api";

function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await getResourceRequests();

            setRequests(data.requests || []);
        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to load requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (
        requestId,
        status
    ) => {
        try {
            const data =
                await updateRequestStatus(
                    requestId,
                    status
                );

            setMessage(
                data.message ||
                "Request updated successfully."
            );

            // Refresh requests
            loadRequests();

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to update request."
            );
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <h1>Requests</h1>
                <p>Loading requests...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Resource Requests</h1>

                    <p>
                        Manage requests for your
                        shared resources.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="dashboard-section">
                    <h3>
                        No requests yet.
                    </h3>

                    <p>
                        When someone requests
                        your resource, it will
                        appear here.
                    </p>
                </div>
            ) : (
                requests.map((request) => (
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
                                Requester:
                            </strong>{" "}
                            {request.requester_name ||
                                "Community Member"}
                        </p>

                        {request.message && (
                            <p>
                                <strong>
                                    Message:
                                </strong>{" "}
                                {request.message}
                            </p>
                        )}

                        <p className="request-status">
                            Status:{" "}
                            <span
                                className={
                                    request.status ===
                                    "PENDING"
                                        ? "status-pending"
                                        : request.status ===
                                          "ACCEPTED"
                                        ? "status-accepted"
                                        : "status-rejected"
                                }
                            >
                                {request.status}
                            </span>
                        </p>

                        {request.status ===
                            "PENDING" && (
                            <div>

                                <button
                                    className="accept-button"
                                    onClick={() =>
                                        handleStatus(
                                            request.id,
                                            "ACCEPTED"
                                        )
                                    }
                                >
                                    ✓ Accept
                                </button>

                                <button
                                    className="reject-button"
                                    onClick={() =>
                                        handleStatus(
                                            request.id,
                                            "REJECTED"
                                        )
                                    }
                                >
                                    ✕ Reject
                                </button>

                            </div>
                        )}

                    </div>
                ))
            )}

        </div>
    );
}

export default Requests;