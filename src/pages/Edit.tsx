import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Hooks';
import { selectAuth, setEditUser, setUserData, updateUserProfile } from '../slices/AuthSlice';
import '../styles/Edit.scss';

function Edit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { editUser } = useAppSelector(selectAuth);
  const token = useAppSelector(selectAuth).token;

  const [firstname, setFirstname] = useState(editUser.user.firstname);
  const [lastname, setLastname] = useState(editUser.user.lastname);
  const [email, setEmail] = useState(editUser.user.email);


  const handleConfirmClick = async () => {
    try {
      dispatch(setEditUser({
        editUser: {
          user: {
            firstname: firstname,
            lastname: lastname,
            email: email,
          }
        }
      }));

      const resultAction = await dispatch(updateUserProfile(token as string));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        const { user, permissions } = resultAction.payload;

        dispatch(setUserData({
          userData: {
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
            },
            permissions: permissions,
          }
        }));

        navigate('/details');
      } else {
        console.error('Erro ao atualizar o perfil:', resultAction.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
    }
  };


  return (
    <main>
      <h2>Edit</h2>
      <div className="box">
        <label className="label" htmlFor="firstname">
          <p>
          firstname:
          </p>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </label>
        <label className="label" htmlFor="lastname">
          <p>
          lastname:
          </p>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </label>
        <label className="label" htmlFor="email">
          <p>email:</p>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button onClick={handleConfirmClick}>Confirm</button>
      </div>
    </main>
  );
}

export default Edit;
