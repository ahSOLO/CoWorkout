import { UserForm } from './UserForm';

export default function Registration(props) {
  return (
    <div className="Registraion">
      <UserForm cookies={props.cookies} setCookie={props.setCookie} setUser={props.setUser} />
    </div>
  )
}