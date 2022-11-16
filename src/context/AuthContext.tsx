import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import * as React from "react";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
interface contextProps{
  user: User|null,
  signIn: Function;
  logOut: Function;
}
interface Props {
  children: ReactNode;
}
const UserContext = createContext<contextProps| null>(null);
export const UserContextProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logOut = () => {
    return signOut(auth);
  }
  useEffect(() => {
    const authState = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => {
      authState();
    }
  },[]);
  return <UserContext.Provider value={{user,signIn,logOut}}>{children}</UserContext.Provider>;
};
export const UserAuth = () => {
  return useContext(UserContext);
};
