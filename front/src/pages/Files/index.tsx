import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { FaEye, FaTrash } from "react-icons/fa"; // Importando os ícones
import CustomModal from "../../components/Modal";
import { MyPdfViewer } from "../../components/PdfViewer";
import GenericTable from "../../components/Table";
import api from "../../services/api";
import { DropzoneContainer, Label } from "./styles";
import { useToast } from "../../contexts/ToastContext";
import api_py from "../../services/api_py";

interface RectangleProperties {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  rotate: number;
  style: {
    fill: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textAnchor: string;
  };
}

const Files: React.FC = () => {
  const { showToast } = useToast();
  const [nome, setNome] = useState("");
  const [validated, setValidated] = useState(false);
  const [rectangles, setRectangles] = useState<RectangleProperties[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<any>(undefined);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const itemsPerPage = 1; // Ajuste aqui se necessário
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC"); // Estado para a ordenação
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca

  const columns = [
    { key: "id", title: "#", dataIndex: "id", width: "50px" },
    { key: "name", title: "Nome", dataIndex: "nome", width: "200px" },
    { key: "actions", title: "Ações", dataIndex: "actions", width: "200px" },
  ];

  const handleSearch: any = (value: string, sort: string) => {
    loadData(currentPage, itemsPerPage, sort, value); // Carrega dados com o termo de busca e a ordem de classificação
  };

  const handleDelete = (record: any) => {
    (async () => {
      try {
        await api.delete(`/arquivos/remover/${record?.id}`);
        showToast("Arquivo removido com sucesso!", "success");
        loadData(currentPage, itemsPerPage, sortOrder, searchTerm); // Recarregar com a mesma página e ordenação
      } catch (e: any) {
        console.error(e);
        showToast("Erro ao remover arquivo!", "warning");
      }
    })();
  };

  const handleView = (record: any) => {
    (async () => {
      try {
        const response = await api.get(`/arquivos/${record?.id}`, {
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
          { responseType: "arraybuffer" }
        );
        if (response.status !== 200) {
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
        showToast("Arquivo não recuperado!", "danger");
      }
    })();
  };

  const loadData = async (
    page: number = 1,
    size: number = itemsPerPage,
    sort: string = sortOrder,
    search: string = ""
  ) => {
    try {
      const params: any = {
        page,
        size, // Alterado para 1 conforme solicitado
        sort,
      };

      // Adiciona o termo de busca aos parâmetros apenas se não estiver vazio ou nulo
      if (search) {
        params.nome = search;
      }

      const response = await api.get(`/arquivos/buscar`, { params });
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData(currentPage, itemsPerPage, sortOrder, searchTerm); // Chamada inicial com paginação, ordenação e busca
  }, [currentPage, sortOrder, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    loadData(currentPage, itemsPerPage, sort, searchTerm); // Carrega os dados com a nova ordenação
  };

  const actionButtons = (record: any) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      <Button variant="primary" onClick={() => handleView(record)}>
        <FaEye /> Visualizar
      </Button>
      <Button variant="danger" onClick={() => handleDelete(record)}>
        <FaTrash /> Deletar
      </Button>
    </div>
  );

  const enhancedData = data.map((item: any) => ({
    ...item,
    actions: actionButtons(item), // Adiciona os botões de ação
  }));

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseFile = () => setShowFile(false);

  const handleSave = async () => {
    try {
      const file = await convertToBase64(selectedFiles[0]);
      const base64 = file?.split(",")[1];
      const labels = rectangles?.map((rect: any) => ({
        coordX: String(rect?.x),
        coordY: String(rect?.y),
        texto: String(rect?.name),
        largura: String(rect?.width),
        altura: String(rect?.height),
        rotacao: String(rect?.rotate),
        cor: String(rect?.style?.fill),
        tamanhoFonte: String(rect?.style?.fontSize),
        familiaFonte: String(rect?.style?.fontFamily),
      }));
      const payload = {
        nome,
        base64,
        labels,
      };
      const response = await api.post(
        "/arquivos/criar",
        JSON.stringify(payload)
      );
      if (response.status !== 200) {
        throw new Error("Falha ao salvar o retângulo");
      }
      showToast("Arquivo salvo com sucesso!", "success");
      loadData(currentPage, itemsPerPage, sortOrder, searchTerm); // Recarrega a tabela após salvar
    } catch (e: any) {
      console.error(e);
    }
    setRectangles([]);
  };

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <GenericTable
        columns={columns}
        data={enhancedData} // Utilize os dados aprimorados
        tableTitle="Arquivos"
        onSearch={handleSearch} // Chama a função de busca
        onShowModal={handleShow}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange} // Passa a função de mudança de ordenação
      />

      <CustomModal
        title="Adicionar arquivo"
        body={
          <div style={{ height: "fit-content" }}>
            <DropzoneContainer>
              <Dropzone onDrop={onDrop} multiple={false} maxFiles={1}>
                {({ getRootProps, getInputProps }: any) => (
                  <section>
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      <p>
                        Arraste e solte um arquivo aqui ou clique para
                        selecionar.
                      </p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </DropzoneContainer>
            {selectedFiles[0] && (
              <Form>
                <Form.Group>
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
              </Form>
            )}
            {selectedFiles[0] && (
              <MyPdfViewer
                file={selectedFiles[0]}
                rectangles={rectangles}
                setRectangles={setRectangles}
              />
            )}
          </div>
        }
        show={show}
        onHide={handleClose}
        onSave={handleSave}
      />

      <CustomModal
        title="Visualizando arquivo"
        body={
          <div style={{ height: "fit-content" }}>
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

export default Files;
