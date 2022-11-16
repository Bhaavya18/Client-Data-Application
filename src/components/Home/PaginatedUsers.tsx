import * as React from "react";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { user } from "./Home";
import styles from "./Home.module.css";
interface Props{
    users: user[];
    deleteUser: Function;
}
export function PaginatedUsers({users,deleteUser}:Props) {
    const [pageNumber, setPageNumber] = useState(0);
    const navigate = useNavigate();
    /* Pagination logic */
    const usersPerPage = 3;
    const startOffset = pageNumber * usersPerPage;
    const displayUsers = users
        .slice(startOffset, startOffset + usersPerPage)
        .map((user) => (
        <div className={styles.clientBox}>
            <div className={styles.clientDelete}>
            <AiFillDelete
                onClick={() => {
                deleteUser(user.id, user.sid);
                }}
            />
            </div>
            <p className={styles.clientName}>{user.Name}</p>
            <button
            onClick={() => {
                navigate("/view/" + user.id);
            }}
            >
            View
            </button>
        </div>
        ));
    const changePage = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
    };
    return (
        <>
            {displayUsers}
            <ReactPaginate
                pageCount={Math.ceil(users.length / usersPerPage)}
                nextLabel=">"
                previousLabel="<"
                onPageChange={changePage}
                containerClassName={styles.pageBtns}
                previousClassName={styles.prevBtn}
                nextClassName={styles.nextBtn}
                activeClassName={styles.activePage}
            />
        </>
    );
    
}
