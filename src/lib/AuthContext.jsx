import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import authdisplaystyle from "../styles/authcontenxt.module.css";

const AuthContext = createContext({ currentUser: null });

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ?
                <div className={authdisplaystyle.container}>
                    <div className={authdisplaystyle.loader}></div>
                </div> : children
            }
        </AuthContext.Provider>
    );
};

export default AuthProvider;
