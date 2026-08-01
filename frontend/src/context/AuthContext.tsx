import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  login as loginRequest,
  register as registerRequest,
  getMe,
  logout as logoutRequest,
} from "../api/auth";

import type { User, RegisterResponse } from "../api/auth";

import { TOKEN_KEY, AUTH_LOGOUT_EVENT } from "../constants/auth";


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<void>;
  register: (
  data: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }
) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(
        TOKEN_KEY
      );

      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
        } catch {
          localStorage.removeItem(
            TOKEN_KEY
          );
        }
      }

      setLoading(false);
    }

    loadUser();
  }, []);


  useEffect(() => {
    function handleForcedLogout() {
      setUser(null);
    }

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    };
  }, []);


  async function login(
    username: string,
    password: string
  ) {
    const response = await loginRequest(
      username,
      password
    );

    localStorage.setItem(
      TOKEN_KEY,
      response.token
    );

    const currentUser = await getMe();

    setUser(currentUser);
  }


  async function register(data: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }) {
    // Registration only creates the account. It does not authenticate
    // the user and the backend does not return a token here, so we must
    // NOT touch localStorage or call getMe()/setUser() in this function.
    // Logging in afterwards (a separate step) is what stores the token.
    const response = await registerRequest(data);

    return response;
  }


  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // Even if backend logout fails,
      // clear local authentication.
    } finally {
      localStorage.removeItem(
        TOKEN_KEY
      );

      setUser(null);
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}