import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface CustomModalProps {
  title: string;
  body: React.ReactNode;
  show: boolean;
  onHide: () => void;
  onSave?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  body,
  show,
  onHide,
  onSave,
}) => {
  return (
    <Modal show={show} onHide={onHide} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        {onSave && (
          <Button
            variant="primary"
            onClick={() => {
              onSave();
              onHide(); // Fecha o modal após salvar
            }}
          >
            Salvar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
