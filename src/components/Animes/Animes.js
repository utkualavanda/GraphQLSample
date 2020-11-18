import React, { useState } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Table, Form, Button} from "react-bootstrap";

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
  const [datas, setDatas] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState([1]);

  let newSearch = "";

  let variables = {
    search: search,
    page: page.length,
    perPage: 10,
  };

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

  if (datas.length > 0) {
    const currentPage = page.length;
    let pageMultiplier = 0;
    currentPage === 1 ? (pageMultiplier = 1) : (pageMultiplier = 10);

    tableRows = datas.map((data, index) => {
      return (
        <tr key={index}>
          <th scope="row">{(currentPage - 1) * pageMultiplier + index + 1}</th>
          <td>{data.title.romaji}</td>
          <td>{data.title.native}</td>
        </tr>
      );
    });

    const pageCount = [...Array(Math.round(pageInfo?.total / variables.perPage)).keys()]

    if (pageCount !== 0) {
      paginationButtons = pageCount.map((_, index) => {
        return (
          <Button key={index} variant="secondary" className="mr-1" onClick={() => changePageHandler(index + 1)}>
            {index + 1}
          </Button>
        );
      });
    }
  }

  return (
    <div>
      <Query query={ANIMES_QUERY} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) console.log("error verdi");
          console.log(data);
          setDatas(data.Page.media);
          setPageInfo(data.Page.pageInfo);
          return null;
        }}
      </Query>

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
            variant="primary"
            onClick={newSearchHandler}
            className={"mb-1"}
            style={{ display: "inline" }}
          >
            Search
          </Button>
        </Form.Group>
      </Form>

      <div className="col-7 m-2">
        <Table>
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
      </div>
    </div>
  );
};

export default Animes;
