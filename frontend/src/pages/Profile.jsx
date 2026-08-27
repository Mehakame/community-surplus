import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile } from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getMyProfile();

            if (data.user) {
                setUser(data.user);
            } else {
                setMessage(
                    data.message || "Unable to load profile."
                );
            }

        } catch (error) {
            console.error("Profile error:", error);

            setMessage(
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <h1>My Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard">
                <h1>My Profile</h1>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>
                    <h1>
                        👤 My Profile
                    </h1>

                    <p>
                        View your Community Surplus
                        account information.
                    </p>
                </div>

            </div>


            <div className="profile-card">

                <div className="profile-avatar">
                    {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"}
                </div>


                <h2>
                    {user.name}
                </h2>


                <div className="profile-info">

                    <div className="profile-item">
                        <strong>
                            Name
                        </strong>

                        <span>
                            {user.name}
                        </span>
                    </div>


                    <div className="profile-item">
                        <strong>
                            Email
                        </strong>

                        <span>
                            {user.email}
                        </span>
                    </div>


                    <div className="profile-item">
                        <strong>
                            Phone
                        </strong>

                        <span>
                            {user.phone || "Not provided"}
                        </span>
                    </div>


                    <div className="profile-item">
                        <strong>
                            Role
                        </strong>

                        <span>
                            {user.role || "User"}
                        </span>
                    </div>

                </div>


                <div className="profile-actions">

                    <Link
                        to="/dashboard"
                        className="btn"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Profile;