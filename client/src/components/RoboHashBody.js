import { React, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

let Robot = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    min-height: 70vh;

    .border {
      width: 250px;
      height: 258px;
      position: relative;
      margin: 10px;
      background: linear-gradient(45deg, #070707, #070707fb, #070707f3);
    }

    .border::before {
      content: '';
      position: absolute;
      top: -2px;
      left -2px;
      background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
      background-size: 400%;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      z-index: -1;
      animation: animate 40s linear infinite alternate;
    }

    @keyframes animate
{
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

    img {
        width: 250px;
        height: 250px;
        margin: 8px;
        
    }

    .paginationBttns {
        width: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        margin-top 3%;
    }

    .paginationBttns a {
        font-size: 1.3rem;
        margin: 3px;  
        padding: 4px 6px;
        border-radius: 5px;
        border 1px solid black;
    }

    .activeBttn a {
      background-color: blue;
    }

    .paginationBttns a:hover {
      background-color: blue;
    }

    @media (max-width: 380px) {
        .paginationBttns a {
            font-size: 16px !important;
        }

        .paginationBttns li {
            display: none;
        }
        
        .previous {
            display: list-item !important;
        }

        .next {
            display: list-item !important;
        }
    }

`;

export default function RoboHashBody({ damount }) {
  let [pageNum, setPageNum] = useState(0);
  let itemsPerPage = 10;
  let pageVisited = pageNum * itemsPerPage;
  let awards = Math.round(damount / 3);
  let robocalls = [];
  for (let i = 0; i <= awards; i++) {
    let link = `https://robohash.org/${i}`;
    robocalls.push(link);
  }
  let displayRobots = robocalls
    .slice(pageVisited, pageVisited + itemsPerPage)
    .map((robot) => {
      return (
        <div className="border">
          <img src={robot} alt="" />
        </div>
      );
    });

  let pageCount = Math.ceil(robocalls.length / itemsPerPage);
  let changePage = ({ selected }) => {
    setPageNum(selected);
  };

  return (
    <>
    {robocalls.length > 0 ? (
      <Robot>
      {displayRobots}
      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        activeClassName={"activeBttn"}
      />
    </Robot>
    ) : (<p>Robots are refusing to show up please try again later</p>)}
    </>
  );
}
