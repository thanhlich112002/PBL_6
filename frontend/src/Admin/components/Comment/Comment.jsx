import React, { useState } from "react";
import Detailstore from "../../Page/ManageStore/Detailstore";

function Comment({ avatarSrc, author, upvotes, text, upvoted }) {
    return (
        <div className="mb-4" style={{ padding: "0px", borderBottom: "1px solid #51cc8a" }} >
            <div className="d-flex flex-row align-items-center">
                <img src={avatarSrc} alt="avatar" width="50" height="50" />
                <div>
                    <p className="" style={{ fontSize: "20", fontWeight: "600", padding: "0px 10px", margin: 0 }}>{author}</p>
                    <p style={{ fontSize: "20", fontWeight: "600", padding: "0px 0px" }}>
                        <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                        <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                        <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                        <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                        <i className="fa-solid fa-star" style={{ color: 'gold' }}></i>
                    </p>

                </div>
            </div>
            <div className="d-flex flex-row align-items-center">
                <p className="small text-muted mb-0">Upvote?</p>
                <i
                    className={`fa${upvoted ? "s" : "r"} fa-thumbs-up mx-2 fa-xs`}
                    style={{ marginTop: "-0.16rem" }}
                ></i>
                <p className="small text-muted mb-0">{upvotes}</p>
            </div>
            <p>{text}</p>
        </div>
    );
}

export default function CommentList(rows) {
    const [comments, setComments] = useState([
        {
            id: 1,
            avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp",
            author: "Martha",
            upvotes: 3,
            text: "Type your note, and hit enter to add it",
            upvoted: false,
        },
        {
            id: 2,
            avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp",
            author: "Johny",
            upvotes: 4,
            text: "Type your note, and hit enter to add it",
            upvoted: false,
        },
        {
            id: 3,
            avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp",
            author: "Mary Kate",
            upvotes: 2,
            text: "Type your note, and hit enter to add it",
            upvoted: true,
        },
        {
            id: 4,
            avatarSrc: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp",
            author: "Mary Kate",
            upvotes: 2,
            text: "Type your note, and hit enter to add it",
            upvoted: true,
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;
    const totalPages = Math.ceil(comments.length / pageSize);

    const handlePageChange = (page) => {
        if (page < 1) {
            page = 1;
        } else if (page > totalPages) {
            page = totalPages;
        }
        setCurrentPage(page);
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: "65%", margin: "10px 10px 10px 20px", borderRadius: "10px", background: "white" }}>
                <div    >
                    <span style={{ fontSize: "20px", borderBottom: "1px solid #51cc8a" }}>Đánh giá từ khách hàng</span>
                </div>
                {comments
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((comment) => (
                        <Comment
                            key={comment.id}
                            avatarSrc={comment.avatarSrc}
                            author={comment.author}
                            upvotes={comment.upvotes}
                            text={comment.text}
                            upvoted={comment.upvoted}
                        />
                    ))}
                <ul className="pagination">
                    <li className={currentPage === 1 ? 'disabled' : ''}>
                        <a className="" onClick={() => handlePageChange(currentPage - 1)}>
                            <i className="fa-solid fa-circle-chevron-left" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i>
                        </a>
                    </li>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                            <a className="undefined" href="#" onClick={() => handlePageChange(index + 1)}>{index + 1}</a>
                        </li>
                    ))}
                    <li className={currentPage === totalPages ? 'disabled' : ''}>
                        <a className="" onClick={() => handlePageChange(currentPage + 1)}>
                            <i className="fa-solid fa-circle-chevron-right" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div style={{ width: "35%", border: "1px soild #51cc8a", borderRadius: "10px", margin: "10px 10px 0", boxShadow: "1 1 1 1" }}>
                <Detailstore rows={rows} />
            </div>
        </div>
    );
}
