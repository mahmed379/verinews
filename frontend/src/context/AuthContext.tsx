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

import type { User } from "../api/auth";


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
    }
  ) => Promise<void>;
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
        "verinews_token"
      );

      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
        } catch {
          localStorage.removeItem(
            "verinews_token"
          );
        }
      }

      setLoading(false);
    }

    loadUser();
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
      "verinews_token",
      response.token
    );

    const currentUser = await getMe();

    setUser(currentUser);
  }


  async function register(data: {
    username: string;
    email: string;
    password: string;
  }) {
    const response = await registerRequest(data);

    localStorage.setItem(
      "verinews_token",
      response.token
    );

    setUser(response.user);
  }


  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // Even if backend logout fails,
      // clear local authentication.
    } finally {
      localStorage.removeItem(
        "verinews_token"
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