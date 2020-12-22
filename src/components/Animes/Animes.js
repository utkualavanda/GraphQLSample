import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Table, Form, Button } from "react-bootstrap";
import Spinner from '../Spinner/Spinner';

const ANIMES_QUERY = gql`
  query($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search) {
        title {
          romaji
          native
        }
      }
    }
  }
`;

const Animes = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState([1]);
  const variables = {
    search: search,
    page: page.length,
    perPage: 10,
  };
  const { loading, data } = useQuery(ANIMES_QUERY, {
    variables: variables
  });
  
  let newSearch = '';

  const changeSearchName = (e) => {
    newSearch = e.target.value;
  };

  const newSearchHandler = () => {
    setSearch(newSearch);
    setPage([1]);
  };

  const changePageHandler = (i) => {
    setPage(new Array(i));
  };

  let tableRows = null;
  let paginationButtons = null;

  if (data?.Page?.media?.length > 0) {
    const currentPage = page.length;
    let pageMultiplier = 0;
    currentPage === 1 ? (pageMultiplier = 1) : (pageMultiplier = variables.perPage);

    tableRows = data.Page.media.map((row, index) => {
      return (
        <tr key={index}>
          <th scope="row">{(currentPage - 1) * pageMultiplier + index + 1}</th>
          <td>{row.title.romaji}</td>
          <td>{row.title.native}</td>
        </tr>
      );
    });

    const pageCount = [...Array(Math.ceil(data?.Page?.pageInfo.total / variables.perPage)).keys()]

    if (pageCount !== 0) {
      paginationButtons = pageCount.map((_, index) => {
        return (
          <Button key={index} variant="dark" className="mr-1" onClick={() => changePageHandler(index + 1)}>
            {index + 1}
          </Button>
        );
      });
    }
  }

  return (
    <>
      <Form>
        <Form.Group className={"mt-2 ml-3"}>
          <Form.Control
            type="input"
            placeholder="Enter an anime name"
            className={"col-3 m-1"}
            onChange={(e) => changeSearchName(e)}
            style={{ display: "inline" }}
          ></Form.Control>
          <Button
            variant="dark"
            onClick={newSearchHandler}
            className={"mb-1"}
          >
            Search
          </Button>
        </Form.Group>
      </Form>

      <div className="col-7 m-1">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Romaji Title</th>
              <th scope="col">Japanese Title</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
        {paginationButtons}
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default Animes;
