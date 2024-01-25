import '../styles/Details.scss';
import { useAppSelector } from '../Hooks';
import { selectAuth } from '../slices/AuthSlice';
import { useNavigate } from 'react-router-dom';



function Details() {
  const navigate = useNavigate();
  const email = useAppSelector(selectAuth).email;
  const firstname = useAppSelector(selectAuth).userData.user.firstname;
  const lastname = useAppSelector(selectAuth).userData.user.lastname;

  return (
    <main>
      <h2>Details</h2>
      <div className="box">
        <h3>{`firstname: ${firstname ? firstname : "******"}`}</h3>
        <h3>{`lastname: ${lastname ? lastname : "******"}`}</h3>
        <h3>{`email: ${email ? email : "******"}`}</h3>
        <button onClick={() => { navigate('/edit'); }}>Edit</button>
      </div>
    </main>
  )
}

export default Details