import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getMyRequests,
    getMyResourceCount
} from "../services/api";

function Dashboard() {
    const [requests, setRequests] = useState([]);
    const [resourceCount, setResourceCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [requestsData, resourcesData] =
                await Promise.all([
                    getMyRequests(),
                    getMyResourceCount()
                ]);

            setRequests(
                requestsData.requests || []
            );

            setResourceCount(
                resourcesData.count || 0
            );

        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests =
        requests.filter(
            (request) =>
                request.status === "PENDING"
        ).length;

    const acceptedRequests =
        requests.filter(
            (request) =>
                request.status === "ACCEPTED"
        ).length;

    const rejectedRequests =
        requests.filter(
            (request) =>
                request.status === "REJECTED"
        ).length;

    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>
                         Welcome to Community Surplus
                    </h1>

                    <p>
                        Manage your shared resources
                        and requests.
                    </p>
                </div>

                <Link
                    to="/post-resource"
                    className="btn"
                >
                    + Share Resource
                </Link>

            </div>


            {/* Statistics */}

           <div className="stats-grid">

    <div className="stat-card">
        <div className="stat-icon resource-icon">📦</div>
        <div className="stat-number">{resourceCount}</div>
        <div className="stat-title">My Resources</div>
    </div>

    <div className="stat-card">
        <div className="stat-icon request-icon">📩</div>
        <div className="stat-number">{requests.length}</div>
        <div className="stat-title">My Requests</div>
    </div>

    <div className="stat-card">
        <div className="stat-icon pending-icon">⏳</div>
        <div className="stat-number">
            {requests.filter(
                (request) => request.status === "pending"
            ).length}
        </div>
        <div className="stat-title">Pending Requests</div>
    </div>

</div>
                

            {/* Quick Actions */}

            <div className="dashboard-section">

                <h2>
                    Quick Actions
                </h2>

                <div className="quick-actions">

                    {/* Share Resource */}

                    <Link
                        to="/post-resource"
                        className="action-card"
                    >
                        <span>
                            ➕
                        </span>

                        <h3>
                            Share Resource
                        </h3>

                        <p>
                            Share extra food or
                            household items.
                        </p>
                    </Link>


                    {/* Nearby Resources */}

                    <Link
                        to="/nearby"
                        className="action-card"
                    >
                        <span>
                            📍
                        </span>

                        <h3>
                            Find Nearby
                        </h3>

                        <p>
                            Find resources available
                            near you.
                        </p>
                    </Link>


                    {/* My Resources */}

                    <Link
                        to="/my-resources"
                        className="action-card"
                    >
                        <span>
                            📦
                        </span>

                        <h3>
                            My Resources
                        </h3>

                        <p>
                            Manage the resources you
                            have shared.
                        </p>
                    </Link>


                    {/* Received Requests */}

                    <Link
                        to="/requests"
                        className="action-card"
                    >
                        <span>
                            📋
                        </span>

                        <h3>
                            Requests
                        </h3>

                        <p>
                            Manage requests received
                            for your resources.
                        </p>
                    </Link>


                    {/* My Requests */}

                    <Link
                        to="/my-requests"
                        className="action-card"
                    >
                        <span>
                            📩
                        </span>

                        <h3>
                            My Requests
                        </h3>

                        <p>
                            Track resources you
                            have requested.
                        </p>
                    </Link>

                </div>

            </div>


            {/* My Recent Requests */}

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>
                        My Recent Requests
                    </h2>

                    <Link
                        to="/my-requests"
                    >
                        View All
                    </Link>

                </div>


                {loading ? (

                    <p>
                        Loading requests...
                    </p>

                ) : requests.length === 0 ? (

                    <p>
                        You haven't requested any
                        resources yet.
                    </p>

                ) : (

                    <div className="request-list">

                        {requests
                            .slice(0, 5)
                            .map(
                                (request) => (

                                    <div
                                        className="request-card"
                                        key={request.id}
                                    >

                                        <span className="resource-category">
                                            {
                                                request.category
                                            }
                                        </span>

                                        <h3>
                                            {
                                                request.title
                                            }
                                        </h3>

                                        <p>
                                            <strong>
                                                Quantity:
                                            </strong>{" "}
                                            {
                                                request.quantity
                                            }{" "}
                                            {
                                                request.unit
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}

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
                                                {
                                                    request.status
                                                }
                                            </span>
                                        </p>

                                    </div>

                                )
                            )}

                    </div>

                )}

            </div>


            {/* Request Summary */}

            <div className="dashboard-section">

                <h2>
                    Request Summary
                </h2>

                <div className="stats-grid">

                    <div className="stat-card">
                        <h3>
                            ⏳
                        </h3>

                        <h2>
                            {pendingRequests}
                        </h2>

                        <p>
                            Pending Requests
                        </p>
                    </div>


                    <div className="stat-card">
                        <h3>
                            ✅
                        </h3>

                        <h2>
                            {acceptedRequests}
                        </h2>

                        <p>
                            Accepted Requests
                        </p>
                    </div>


                    <div className="stat-card">
                        <h3>
                            ❌
                        </h3>

                        <h2>
                            {rejectedRequests}
                        </h2>

                        <p>
                            Rejected Requests
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;