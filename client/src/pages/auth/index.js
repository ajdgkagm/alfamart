import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/clerk-react';
export const Auth = () => {
    return (_jsxs("div", { className: "sign-in-container", children: [_jsxs(SignedOut, { children: [_jsx(SignUpButton, { mode: "modal" }), _jsx(SignInButton, { mode: "modal" })] }), _jsx(SignedIn, { children: _jsx(UserButton, {}) })] }));
};
