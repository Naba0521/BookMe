"use client";
import { api, setAuthToken } from "@/axios";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
};

type AuthContextType = {
  user?: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);
export const UserAuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const params = useParams();
  const companyName = params?.companyName as string;

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post(`/authuser/login`, {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      router.push(`/company/${companyName}`);
      return data.user;
    } catch (error) {
      toast.error("Нэвтрэхэд алдаа гарлаа.");
      return undefined;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await api.post(`/authuser/signup`, {
        email,
        password,
        username,
      });

      const { data, status } = response;

      localStorage.setItem("token", data.token);
      setUser(data.user);
      router.push(`/company/${companyName}`);
      if (status === 200 || status === 201) {
        toast.success("Амжилттай бүртгэгдлээ!", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Имэйл хаяг бүртгэлтэй байна.", {
          position: "top-center",
        });
      } else {
        toast.error("Бүртгүүлэхэд алдаа гарлаа.", {
          position: "top-center",
        });
      }
      console.error("Signup error:", error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(undefined);
    router.push(`/company/${companyName}`);
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log("token :", token);

    if (!token) return;

    setAuthToken(token);
    try {
      const { data } = await api.get(`/authuser/me`);
      console.log("Irj bga user data:", data);

      setUser(data);
    } catch (error) {
      console.error("user data aldaa:", error);
      // localStorage.removeItem("token");
      // setUser(undefined);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
