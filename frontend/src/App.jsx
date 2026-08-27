import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostResource from "./pages/PostResource";
import NearbyResources from "./pages/NearbyResources";
import Requests from "./pages/Requests";
import ResourceDetails from "./pages/ResourceDetails";
import MyRequests from "./pages/MyRequests";
import MyResources from "./pages/MyResources";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <main className="app-container">

                <Routes>

                    {/* Public */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />
<Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>
<Route
    path="/reset-password"
    element={<ResetPassword />}
/>
                    <Route
                        path="/resources/:id"
                        element={<ResourceDetails />}
                    />


                    {/* Protected */}

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/post-resource"
                        element={
                            <ProtectedRoute>
                                <PostResource />
                            </ProtectedRoute>
                        }
                    />
                    
<Route
    path="/my-resources"
    element={
        <ProtectedRoute>
            <MyResources />
        </ProtectedRoute>
    }
/>
                    <Route
                        path="/nearby"
                        element={
                            <ProtectedRoute>
                                <NearbyResources />
                            </ProtectedRoute>
                        }
                    />

                    <Route
    path="/my-requests"
    element={
        <ProtectedRoute>
            <MyRequests />
        </ProtectedRoute>
    }
/>
<Route
    path="/requests"
    element={
        <ProtectedRoute>
            <Requests />
        </ProtectedRoute>
    }
/>
<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;