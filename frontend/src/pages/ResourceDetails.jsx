import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    getResourceById,
    requestResource
} from "../services/api";

function ResourceDetails() {
    const { id } = useParams();

    const [resource, setResource] = useState(null);
    const [message, setMessage] = useState("");
    const [requestMessage, setRequestMessage] =
        useState("");
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] =
        useState(false);

    useEffect(() => {
        loadResource();
    }, [id]);

    const loadResource = async () => {
        try {
            const data =
                await getResourceById(id);

            if (data.resource) {
                setResource(data.resource);
            } else {
                setMessage(
                    data.message ||
                    "Resource not found."
                );
            }
        } catch (error) {
            console.error(error);
            setMessage(
                "Unable to load resource."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to request this resource."
            );
            return;
        }

        setRequesting(true);
        setMessage("");

        try {
            const data =
                await requestResource(
                    id,
                    requestMessage
                );

            setMessage(
                data.message ||
                "Request sent successfully."
            );

            if (data.request) {
                setRequestMessage("");
            }

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to send request."
            );
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="details-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="details-container">
                <h1>Resource Not Found</h1>

                <p>{message}</p>

                <Link to="/">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="details-container">

            <span className="resource-category">
                {resource.category}
            </span>

            <h1>
                {resource.title}
            </h1>

            <div className="details-row">
                <strong>
                    Description:
                </strong>

                <p>
                    {resource.description}
                </p>
            </div>

            <div className="details-row">
                <strong>
                    Quantity:
                </strong>

                <p>
                    {resource.quantity}{" "}
                    {resource.unit}
                </p>
            </div>

            <div className="details-row">
                <strong>
                    Status:
                </strong>

                <p>
                    {resource.status}
                </p>
            </div>

            <div className="details-row">
                <strong>
                    Location:
                </strong>

                <p>
                    📍{" "}
                    {resource.latitude},{" "}
                    {resource.longitude}
                </p>
            </div>

            {resource.status ===
                "AVAILABLE" && (
                <div className="location-box">

                    <h3>
                        Request this resource
                    </h3>

                    <textarea
                        placeholder="Write a message to the donor..."
                        value={requestMessage}
                        onChange={(e) =>
                            setRequestMessage(
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={handleRequest}
                        disabled={requesting}
                    >
                        {requesting
                            ? "Sending..."
                            : "Request Resource"}
                    </button>

                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <br />

            <Link to="/">
                ← Back to Resources
            </Link>

        </div>
    );
}

export default ResourceDetails;