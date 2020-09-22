import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";


const PrivateRoute = ({ component, ...args }: any) => (
    <Route
        component={withAuthenticationRequired(component, {
            onRedirecting: () => (<h3 style={{textAlign: 'center'}}>User is not authenticated</h3>),
        })}
        {...args}
    />
);

export default PrivateRoute;