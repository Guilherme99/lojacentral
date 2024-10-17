import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import * as Yup from "yup";
import CustomModal from "../../components/Modal";
import GenericTable from "../../components/Table";
import api from "../../services/api";
import { Label } from "./styles";
import { useToast } from "../../contexts/ToastContext";
import api_py from "../../services/api_py";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  selectedFile: Yup.object()
    .nullable()
    .required("Arquivo é obrigatório")
    .test(
      "is-zero",
      "Por favor, selecione um arquivo válido",
      (value) => value?.value !== "0"
    ),
});

const Solicitations: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [nome, setNome] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileError, setFileError] = useState("");
  const [labels, setLabels] = useState([]);
  const [currentFile, setCurrentFile] = useState<any>(undefined);
  const [showFile, setShowFile] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const itemsPerPage = 10; // Definindo itens por página
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    { key: "index", title: "#", dataIndex: "id", width: "50px" },
    { key: "name", title: "Nome", dataIndex: "nome", width: "200px" },
    // { key: "arquivo", title: "Arquivo", dataIndex: "arquivo", width: "200px" },
    { key: "actions", title: "Ações", dataIndex: "actions", width: "200px" },
  ];

  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return [{ label: "Selecione", value: "0" }];
    }

    try {
      const response = await api.get(`/arquivos/buscar?nome=${inputValue}`);
      return (
        response?.data?.data?.map((file: any) => ({
          value: file?.id,
          label: file?.nome,
        })) || []
      );
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      return [];
    }
  };

  const fetchLabels = async (fileId: string) => {
    try {
      const response = await api.get(`/arquivos/labels/${fileId}`);
      setLabels(response?.data || []);
    } catch (error) {
      console.error("Erro ao buscar labels:", error);
      setLabels([]);
    }
  };

  const handleFileSelect = (selectedOption: any) => {
    setSelectedFile(selectedOption);
    setFileError(""); // Reseta a mensagem de erro ao selecionar um arquivo
    if (selectedOption && selectedOption.value !== "0") {
      fetchLabels(selectedOption.value); // Busca os labels
    } else {
      setLabels([]); // Limpa os labels se um arquivo inválido for selecionado
    }
  };

  const handleDelete = (record: any) => {
    (async () => {
      try {
        await api.delete(`/solicitacoes/remover/${record?.id}`);
        loadData();
        showToast("Arquivo removido com sucesso!", "success");
      } catch (e: any) {
        console.error(e);
        showToast("Erro ao remover arquivo!", "warning");
      }
    })();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleView = (record: any) => {
    (async () => {
      try {
        const response = await api.get(`/arquivos/${record?.arquivo?.id}`, {
          responseType: "arraybuffer",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });

        const pdfFile = new File([pdfBlob], "document.pdf", {
          type: "application/pdf",
        });

        const base64Pdf = await convertToBase64(pdfFile);
        const labels = record?.labels?.map((rect: any) => ({
          coordX: Number(rect?.coordX),
          coordY: Number(rect?.coordY),
          texto: rect?.texto,
          largura: Number(rect?.largura),
          altura: Number(rect?.altura),
          rotacao: Number(rect?.rotacao),
          style: {
            fill: rect?.cor,
            fontFamily: rect?.familiaFonte,
            fontWeight: "bold",
            textAnchor: "middle",
            fontSize: rect?.tamanhoFonte + "px",
          },
        }));

        const payload = {
          base64: base64Pdf?.split(",")[1],
          labels: labels,
        };

        const response2 = await api_py.post(
          "/add_rectangle",
          JSON.stringify(payload),
          {
            responseType: "arraybuffer",
          }
        );

        if (response.status != 200) {
          throw new Error("Falha ao salvar o retângulo");
        }

        const pdfBlob2 = new Blob([response2.data], {
          type: "application/pdf",
        });
        const url2 = window.URL.createObjectURL(pdfBlob2);
        setCurrentFile(url2);
        setShowFile(true);
        showToast("Arquivo recuperado!", "success");
      } catch (e: any) {
        console.error(e);
        return e;
      }
    })();
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    loadData(currentPage, itemsPerPage, sort, searchTerm); // Carrega os dados com a nova ordenação
  };

  const loadData = async (
    page: number = currentPage,
    size: number = itemsPerPage,
    sort: string = sortOrder,
    search: string = searchTerm
  ) => {
    try {
      const params: any = {
        page,
        size,
        sort,
      };

      if (search) {
        params.nome = search;
      }

      const response = await api.get("/solicitacoes/buscar", { params });
      setData(response?.data?.data);
      // console.log('response?.data?.data', response?.data?.data)
      setTotalPages(response.data.totalPages);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData(currentPage, itemsPerPage, sortOrder, searchTerm); // Chamada inicial com paginação, ordenação e busca
  }, [currentPage, sortOrder, searchTerm]);

  const handleClose = () => {
    setShow(false);
    setNome("");
    setSelectedFile(null);
    setValidated(false);
    setFileError("");
    setLabels([]);
  };

  const handleCloseFile = () => setShowFile(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      await validationSchema.validate({
        nome,
        selectedFile,
      });

      const newLabels = labels?.map((rect: any) => ({
        coordX: String(rect?.coordX),
        coordY: String(rect?.coordY),
        texto: String(rect?.value),
        largura: String(rect?.largura),
        altura: String(rect?.altura),
        rotacao: String(rect?.rotacao),
        cor: String(rect?.cor),
        tamanhoFonte: String(rect?.tamanhoFonte),
        familiaFonte: String(rect?.familiaFonte),
      }));

      const payload = {
        nome,
        idArquivo: selectedFile?.value,
        labels: newLabels,
      };

      const response = await api.post(
        "/solicitacoes/criar",
        JSON.stringify(payload)
      );

      if (response.status != 200) {
        throw new Error("Falha ao salvar solicitação");
      }
      showToast("Solicitação salvo com sucesso!", "success");
      loadData();
      handleClose();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        if (error.errors) {
          setFileError(error.errors[0]);
        }
        setValidated(true);
      }
      console.error(error);
    }
  };

  const handleSearch: any = (value: string, sort: string) => {
    loadData(currentPage, itemsPerPage, sort, value); // Carrega dados com o termo de busca e a ordem de classificação
  };

  return (
    <>
      <GenericTable
        columns={columns}
        data={data.map((item: any) => ({
          ...item,
          actions: (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="primary" onClick={() => handleView(item)}>
                <FaEye /> Visualizar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(item)}>
                <FaTrash /> Deletar
              </Button>
            </div>
          ),
        }))}
        onSearch={handleSearch}
        tableTitle="Solicitações"
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSortChange={handleSortChange}
        onShowModal={() => setShow(true)}
      />

      <CustomModal
        title="Adicionar Solicitação"
        body={
          <div style={{ height: "fit-content" }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group
                as={Col}
                controlId="formNome"
                style={{ margin: "1rem 0" }}
              >
                <Label>Nome</Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    style={{ width: "400px" }}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    isInvalid={validated && !nome}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, insira um nome.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group
                as={Col}
                controlId="formFileSelect"
                style={{ margin: "1rem 0" }}
              >
                <Label>Selecionar Arquivo</Label>
                <AsyncSelect
                  placeholder="Digite para buscar arquivos..."
                  cacheOptions
                  loadOptions={loadOptions}
                  defaultOptions={[{ label: "Selecione", value: "0" }]} // Opção padrão
                  onChange={handleFileSelect}
                  value={selectedFile}
                  styles={{
                    container: (provided) => ({ ...provided, width: "400px" }),
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {fileError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Renderizando os campos de rótulo dinamicamente */}
              {labels.map((label: any, index) => (
                <Form.Group
                  as={Col}
                  controlId={`formLabel_${index}`}
                  key={index}
                  style={{ margin: "1rem 0" }}
                >
                  <Label>{label?.texto?.replace("_", " ")}</Label>
                  <Form.Control
                    type="text"
                    value={label?.value}
                    onChange={(e) => {
                      const updatedLabels = [...labels];
                      updatedLabels[index].value = e.target.value;
                      setLabels(updatedLabels);
                    }}
                  />
                </Form.Group>
              ))}

              <Button type="submit">Salvar</Button>
            </Form>
          </div>
        }
        show={show}
        onHide={handleClose}
      />

      <CustomModal
        title="Visualizando arquivo"
        body={
          <div
            style={{
              height: "fit-content",
            }}
          >
            {currentFile && (
              <iframe
                src={currentFile}
                style={{ width: "100%", height: "100vh", border: "none" }}
                title="PDF Resultante"
              />
            )}
          </div>
        }
        show={showFile}
        onHide={handleCloseFile}
      />
    </>
  );
};

export default Solicitations;
