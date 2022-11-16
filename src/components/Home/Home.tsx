import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase-config";
import { PaginatedUsers } from "./PaginatedUsers";
import styles from "./Home.module.css";
import { BsSearch } from "react-icons/bs";
export interface user {
  Name: string;
  sid: string;
  id: string;
}
export function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<user[]>([]);
  const [searchRes, setSearchRes] = useState<user[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const usersCollectionRef = collection(db, "Clients");
  const logOut = UserAuth()?.logOut;
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          Name: doc.data().companyName,
          sid: doc.data().sid,
          id: doc.id,
        }))
      );
    };
    getUsers();
    document.body.style.margin = "0";
    return (() => {    //executed when component unmounts
      document.body.style.margin = "2%";
    });
  }, []);
  useEffect(() => {
    setSearchRes(users.filter((user) => getUser(user)));
  }, [searchTerm, users]);
  const deleteFolder = async (sid: string) => {
    const storageRef = ref(storage, `images-${sid}/`);
    try {
      const content = await listAll(storageRef);
      for (let i = 0; i < content.items.length; i++) {
        await deleteFile(`images-${sid}/` + content.items[i].name);
      }
    } catch {
      console.log(Error);
    }
  };
  const deleteFile = async (path: string) => {
    const storageRef = ref(storage, path);
    try {
      await deleteObject(storageRef);
    } catch {
      console.log(Error);
    }
  };
  const deleteUser = async (id: string, sid: string) => {
    try {
      await deleteFolder(sid);
      await deleteDoc(doc(db, "Clients", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      console.log(Error);
    }
  };
  const handleLogOut = async () => {
    try {
      if (logOut !== undefined) {
        await logOut();
        navigate("/");
      }
    } catch(error) {
       if (error instanceof Error) {
         console.log(error);
       } else {
         console.log("Unexpected error", error);
       }
    }
  }
  const getUser = (user:user) => {
    if (searchTerm === "" || user.Name.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;
    return false;
  }
  return (
    <div className={styles.home}>
      <div className={styles.homeBar}>
        <button onClick={handleLogOut}>Logout</button>
      </div>
      <div className={styles.homeBox}>
        <h1>Shivam Products</h1>
        <div className={styles.search}>
          <input
            type="text"
            className={styles.searchBox}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <BsSearch className={styles.searchIcon} />
        </div>
        <div className={styles.usersBox}>
          {searchRes.length > 0 && (
            <PaginatedUsers users={searchRes} deleteUser={deleteUser} />
          )}
          {searchRes.length === 0 && <p>No Results found.</p>}
        </div>
        <button
          className={styles.create}
          onClick={() => {
            navigate("/create");
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
