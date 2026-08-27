import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource } from "../services/api";

function PostResource() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Food",
        quantity: "",
        unit: "pieces",
        latitude: "",
        longitude: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMessage(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((prev) => ({
                    ...prev,
                    latitude:
                        position.coords.latitude,
                    longitude:
                        position.coords.longitude
                }));

                setMessage(
                    "Location added successfully."
                );
            },
            () => {
                setMessage(
                    "Please allow location access."
                );
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!form.title.trim()) {
            setMessage(
                "Please enter a resource title."
            );
            return;
        }

        if (!form.quantity) {
            setMessage(
                "Please enter quantity."
            );
            return;
        }

        if (
            form.latitude === "" ||
            form.longitude === ""
        ) {
            setMessage(
                "Please add your location."
            );
            return;
        }

        setLoading(true);

        try {
            const data = await createResource({
                title: form.title,
                description: form.description,
                category: form.category,
                quantity: Number(form.quantity),
                unit: form.unit,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude)
            });

            if (data.message) {
                setMessage(data.message);
            }

            if (data.resource) {
                navigate(
                    `/resources/${data.resource.id}`
                );
            }

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to create resource."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>
                         Share Surplus
                    </h1>

                    <p>
                        Share extra resources with
                        your local community.
                    </p>
                </div>
            </div>

            <div className="dashboard-section">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>
                            Resource Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            placeholder="Example: Extra Food Packets"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Describe the resource..."
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
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

                    <div className="form-group">
                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            min="1"
                            name="quantity"
                            placeholder="Example: 10"
                            value={form.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Unit
                        </label>

                        <select
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                        >
                            <option value="pieces">
                                Pieces
                            </option>

                            <option value="packets">
                                Packets
                            </option>

                            <option value="kg">
                                Kg
                            </option>

                            <option value="litres">
                                Litres
                            </option>

                            <option value="boxes">
                                Boxes
                            </option>
                        </select>
                    </div>

                    <div className="location-box">

                        <h3>
                             Resource Location
                        </h3>

                        <button
                            type="button"
                            onClick={
                                useCurrentLocation
                            }
                        >
                            Use My Current Location
                        </button>

                        <div className="form-group">

                            <label>
                                Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={
                                    form.latitude
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={
                                    form.longitude
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sharing..."
                            : "Share Resource"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default PostResource;