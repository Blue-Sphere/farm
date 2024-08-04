import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface AlertProps {
  title: string;
  text: string;
  icon: "warning" | "error" | "success" | "info" | "question";
}

export default function Alert(props: AlertProps) {
  const showSwal = () => {
    withReactContent(Swal).fire({
      icon: props.icon,
      title: props.title,
      text: props.text,
    });
  };

  return showSwal;
}
