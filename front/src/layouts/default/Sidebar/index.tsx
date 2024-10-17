import { Styles } from "./styles";

export const Sidebar = () => {
  return (
    <Styles>
      <img
        className="cover"
        src={
          "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=50"
        }
      />
      <div className="profile">
        <img className="avatar" src="https://github.com/Guilherme99.png" />
        <strong>Italo Guilherme</strong>
        <span>Web Developer</span>
      </div>
      <div className="separator" />
      <div className="informations">
        <ul className="contacts">
          <li>
            Phone: <strong>0000000</strong>
          </li>
          <li>
            E-mail: <strong>italo@.com</strong>
          </li>
          <li>
            E-mail: <strong>italo@.com</strong>
          </li>
        </ul>
        <ul className="labels">
          <li></li>
        </ul>
      </div>
      {/* <footer className="footer"> */}
      {/* <a href=""> */}
      {/* <PencilLine size={20} /> */}
      {/* Editar seu perfil */}
      {/* </a> */}
      {/* </footer> */}
    </Styles>
  );
};
