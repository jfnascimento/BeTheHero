import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom'
import './style.css';
import heroesImg from '../../assets/heroes.png';
import logoImg from '../../assets/logo.svg';
import { FiLogIn } from 'react-icons/fi';
import api from '../../services/api';

export default function Logon({children}) {
  const [id, setId] = useState('');
  const history = useHistory();
  const ongId = localStorage.getItem('ongId');
  if(ongId){
    history.push('/profile');
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post('sessions', {id});
      localStorage.setItem('ongId', id);
      localStorage.setItem('ongName', response.data.name);
      history.push('/profile');
    } catch (error) {
      alert('Falha no login, tente novamente.')
    }

  }
  return (
    <div className="logo-container">
      <div className="content">
        <section className="form">
          <img src={logoImg} alt="be the hero" />
          <form onSubmit={handleLogin}>
            <h1>Faça seu logon</h1>
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="Sua ID"
            />
            <button className="button" type="submit">Entrar</button>
            <Link className="back-link" to="/register">
              <FiLogIn size={16} color="#e02041"/>
                Não tenho cadastro
              </Link>
          </form>
        </section>
        <img className="logo" src={heroesImg} alt="Heroes" />
      </div>
    </div>
    );
  }
  