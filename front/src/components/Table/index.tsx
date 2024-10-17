import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import { ContainerHeader, FormContainer } from "./styles";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";

const GenericTable: React.FC<{
  columns: Array<any>;
  data: Array<any>;
  tableTitle?: string;
  onSearch?: (value: string, value2: string) => void;
  onShowModal: () => void;
  itemsPerPage?: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sort: string) => void; // Prop para a ordenação
}> = ({
  columns,
  data,
  tableTitle,
  onSearch,
  onShowModal,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value, sortOrder); // Passa o valor da pesquisa e a ordem de classificação
    }
  };

  const handleSortChange: any = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSortOrder(sortValue);
    if (onSortChange) {
      onSortChange(sortValue); // Chama a função de ordenação com o novo valor
      if (onSearch) {
        onSearch(searchValue, sortValue); // Também atualiza a busca com a nova ordem
      }
    }
  };

  return (
    <FormContainer>
      <ContainerHeader>
        {tableTitle && <h3>{tableTitle}</h3>}
        <Button
          variant="primary"
          style={{ margin: "20px 0" }}
          onClick={onShowModal}
        >
          <FaPlusCircle /> Adicionar
        </Button>
      </ContainerHeader>
      <Form.Group
        controlId="formSortOrder"
        as={Row}
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Col style={{ padding: "0" }}>
          <Form.Label htmlFor="searchInput">Pesquisar:</Form.Label>
          <Form.Control
            id="searchInput"
            type="text"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={handleSearchChange} // Atualiza o valor do input
            style={{ flex: "1" }}
          />
        </Col>
        <Col style={{ padding: "0" }}>
          <Form.Label htmlFor="sortSelect">Ordenar por:</Form.Label>
          <Form.Control
            id="sortSelect"
            as="select"
            value={sortOrder}
            onChange={handleSortChange}
            style={{ flex: "1" }}
          >
            <option value="ASC">Ascendente</option>
            <option value="DESC">Descendente</option>
          </Form.Control>
        </Col>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>{item[col.dataIndex]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                Não possui dados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </FormContainer>
  );
};

export default GenericTable;
