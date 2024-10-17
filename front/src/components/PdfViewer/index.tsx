import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import fontFamilies from "../../utils/constants";
import { PdfContainer } from "./styles";
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

interface MyPdfViewerProps {
  file: File;
  rectangles: RectangleProperties[];
  setRectangles: any;
}

export const MyPdfViewer: React.FC<MyPdfViewerProps> = ({
  file,
  rectangles,
  setRectangles,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRectangle, setCurrentRectangle] =
    useState<RectangleProperties | null>({
      id: Date.now(),
      x: 220,
      y: 390,
      width: 200,
      height: 100,
      name: "NOME_PESSOA",
      rotate: -90,
      style: {
        fill: "#000000",
        fontSize: 34,
        fontFamily: "Arial",
        fontWeight: "bold",
        textAnchor: "middle",
      },
    });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handlePropertyChange = (
    key:
      | keyof RectangleProperties["style"]
      | keyof Omit<RectangleProperties, "style">,
    value: any
  ) => {
    if (currentRectangle) {
      setCurrentRectangle((prev) => ({
        ...prev,
        [key]: key === "name" ? value : Number(value),
        ...(key in currentRectangle.style
          ? { style: { ...prev.style, [key]: value } }
          : {}),
      }));
    }
  };

  const handleSave = async () => {
    if (currentRectangle) {
      const base64Pdf = await convertToBase64(file);

      let labels = null;
      let newRectangles = rectangles;

      const newRectangle = {
        ...currentRectangle,
        id: currentRectangle?.id || Date.now(), // Garante um ID para novos retângulos
      };

      const isEditing = newRectangles.some(
        (rect) => rect.id === newRectangle.id
      );
      const exists = newRectangles.some(
        (rect) =>
          rect.x === newRectangle?.x &&
          rect.y === newRectangle?.y &&
          rect.name === newRectangle?.name &&
          rect.width === newRectangle?.width &&
          rect.height === newRectangle?.height &&
          rect.rotate === newRectangle?.rotate &&
          (!isEditing || rect?.id !== newRectangle?.id)
      );

      if (!exists) {
        if (isEditing) {
          newRectangles = newRectangles.map((rect) =>
            rect.id === newRectangle?.id ? newRectangle : rect
          );
        } else {
          newRectangles.push(newRectangle);
        }
        setRectangles(newRectangles);

        labels = newRectangles.map((rect) => ({
          coordX: rect?.x,
          coordY: rect?.y,
          texto: rect?.name,
          largura: rect?.width,
          altura: rect?.height,
          rotacao: rect?.rotate,
          style: { ...rect?.style, fontSize: rect?.style?.fontSize + "px" },
        }));

        const payload = {
          base64: base64Pdf?.split(",")[1],
          labels: labels,
        };

        try {
          const response = await api_py.post(
            "/add_rectangle",
            JSON.stringify(payload),
            {
              responseType: "arraybuffer",
            }
          );

          if (response.status != 200) {
            throw new Error("Falha ao salvar o retângulo");
          }

          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          const url = window.URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        } catch (error) {
          console.error("Erro ao salvar:", error);
        }
      } else {
        console.log("Retângulo já existe!");
      }
    }
    handleModalClose();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEdit = (rectangle: RectangleProperties) => {
    setCurrentRectangle(rectangle);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    const newRectangles = rectangles?.filter((rect) => rect.id !== id);
    setRectangles(newRectangles);

    if (newRectangles?.length != 0) {
      const base64Pdf = await convertToBase64(file);
      let labels = null;
      labels = newRectangles.map((rect) => ({
        coordX: rect?.x,
        coordY: rect?.y,
        texto: rect?.name,
        largura: rect?.width,
        altura: rect?.height,
        rotacao: rect?.rotate,
        style: { ...rect?.style, fontSize: rect?.style?.fontSize + "px" },
      }));

      const payload = {
        base64: base64Pdf?.split(",")[1],
        labels: labels,
      };

      try {
        const response = await api_py.post(
          "/add_rectangle",
          JSON.stringify(payload),
          {
            responseType: "arraybuffer",
          }
        );

        if (response.status != 200) {
          throw new Error("Falha ao salvar o retângulo");
        }

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    } else {
      const url = window.URL.createObjectURL(file);
      setPdfUrl(url);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentRectangle(null);
  };

  const openModal = () => {
    setCurrentRectangle({
      id: Date.now(),
      x: 220,
      y: 390,
      width: 200,
      height: 100,
      name: "DIGITE_SEU_TEXTO",
      rotate: -90,
      style: {
        fill: "#000000",
        fontSize: 34,
        fontFamily: "Arial",
        fontWeight: "bold",
        textAnchor: "middle",
      },
    });
    setModalVisible(true);
  };

  useEffect(() => {
    if (file != null) {
      (async () => {
        await handleSave();
      })();
    }
  }, [file]);

  return (
    <PdfContainer>
      <div>
        <div style={{ marginBottom: "20px" }}>
          <Button variant="primary" onClick={openModal}>
            Adicionar Retângulo
          </Button>
        </div>

        <Modal
          show={modalVisible}
          onHide={handleModalClose}
          centered
          style={{ maxWidth: "400px", marginLeft: "100px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {currentRectangle ? "Editar Retângulo" : "Adicionar Retângulo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nome:</Form.Label>
                <Form.Control
                  type="text"
                  value={currentRectangle ? currentRectangle.name : ""}
                  onChange={(e) => handlePropertyChange("name", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formX">
                <Form.Label>X:</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle ? currentRectangle.x : 0}
                  onChange={(e) => handlePropertyChange("x", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formY">
                <Form.Label>Y:</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle ? currentRectangle.y : 0}
                  onChange={(e) => handlePropertyChange("y", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formWidth">
                <Form.Label>Largura:</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle ? currentRectangle.width : 200}
                  onChange={(e) =>
                    handlePropertyChange("width", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="formHeight">
                <Form.Label>Altura:</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle ? currentRectangle.height : 100}
                  onChange={(e) =>
                    handlePropertyChange("height", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="rotate">
                <Form.Label>Rotação:</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle ? currentRectangle.rotate : 0}
                  onChange={(e) =>
                    handlePropertyChange("rotate", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group controlId="formFill">
                <Form.Label>Cor do Texto:</Form.Label>
                <Form.Control
                  type="color"
                  value={currentRectangle?.style.fill}
                  onChange={(e) => handlePropertyChange("fill", e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formFontSize">
                <Form.Label>Tamanho da Fonte (px):</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRectangle?.style.fontSize}
                  onChange={(e) =>
                    handlePropertyChange("fontSize", Number(e.target.value))
                  }
                  min={1}
                />
              </Form.Group>
              <Form.Group controlId="formFontFamily">
                <Form.Label>Família da Fonte:</Form.Label>
                <Form.Control
                  as="select"
                  value={currentRectangle?.style.fontFamily}
                  onChange={(e) =>
                    handlePropertyChange("fontFamily", e.target.value)
                  }
                >
                  {fontFamilies.map((font, index) => (
                    <option key={index} value={font}>
                      {font}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Fechar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {currentRectangle ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </Modal.Footer>
        </Modal>

        <div style={{ marginTop: "20px" }}>
          {rectangles?.length > 0 && (
            <>
              <h4>Retângulos Adicionados</h4>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {rectangles.map((rect) => (
                  <li key={rect.id} style={{ marginBottom: "10px" }}>
                    {`${rect.name} (X: ${rect.x}, Y: ${rect.y}, Largura: ${rect.width}, Altura: ${rect.height}, Rotação: ${rect.rotate} graus)`}
                    <Button variant="link" onClick={() => handleEdit(rect)}>
                      Editar
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(rect.id)}
                      style={{ color: "red" }}
                    >
                      Excluir
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          style={{ width: "60%", height: "100%", border: "none" }}
          title="PDF Resultante"
        />
      )}
    </PdfContainer>
  );
};
