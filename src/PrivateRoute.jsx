// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies

const PrivateRoute = ({ element }) => {
    const token = Cookies.get('token'); // Check for authentication token in cookies

    return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
