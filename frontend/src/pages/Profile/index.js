import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom'
import './style.css';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

export default function Profile() {
  const ongName = localStorage.getItem('ongName');
  const ongId = localStorage.getItem('ongId');
  const [incidents, setIncidents] = useState([]);

  const history = useHistory();

  if(!ongId){
    history.push('/');
  };

  useEffect(() => {
    
    api.get('profiles', {
      headers: {
        Authorization: ongId
      },
    }).then(response => {
      setIncidents(response.data);
    });
  }, [incidents, ongId]);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      });
      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch (error) {
      alert('Erro ao deletar o caso');
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bém vinda, {ongName}</span>
        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={() => handleLogout()} type="button"><FiPower size={18} color="#e02041" /></button>
      </header>
      <h1>Casos cadastrados</h1>
      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>Caso:</strong>
            <p>{incident.title}</p>
            <strong>Descrição</strong>
            <p>{incident.description}</p>
            <strong>Valor:</strong>
            <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
            <button onClick={()=> handleDeleteIncident(incident.id)} type="button"><FiTrash2 size={20} color="#a8a8b3" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}