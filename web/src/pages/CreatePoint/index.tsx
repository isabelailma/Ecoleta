import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft, FiUpload, FiCheckCircle} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';

//Sempre que criar um estado para array ou objeto: manualmente informar o tipo da variável

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface State {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [inicialPosition, setInicialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    number: '',
  });

  const [selectedUf, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [successSubmit, setSuccessSubmit] = useState('hide');

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;

      setInicialPosition([latitude, longitude]);

      // setInicialPosition([
      //   position.coords.latitude,
      //   position.coords.longitude,
      // ]);
    });
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      setStates(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      setCities(response.data);
    });
  }, [selectedUf]);

  function handleSelectUf(event:ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUF(uf);
  }

  function handleSelectCity(event:ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }
  
  function handleMapClick(event:LeafletMouseEvent) {
    const {lat, lng} = event.latlng;

    setSelectedPosition([lat, lng]);
    // setSelectedPosition([
    //   event.latlng.lat,
    //   event.latlng.lng,
    // ]);
  }

  function handleInputChange(event:ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFormData({...formData, [name]: value});
  }

  function handleSelectedItem(id:number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event:FormEvent) {
    event.preventDefault();

    const {name, email, whatsapp, number} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;
    const [latitude, longitude] = selectedPosition;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      number,
      latitude,
      longitude,
      items
    };

    await api.post('points', data);

    setSuccessSubmit('');

    setTimeout( () => {history.push('/')}, 1000);
  }

  return (

    <div id="page-create-point">
      <div id="modal" className={successSubmit}>
        <div className="content">
          <span><FiCheckCircle /></span>
          <h1>Cadastro concluído!</h1>
        </div>
      </div>  
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta"/>
          <Link to="/">
            <span>
              <FiArrowLeft />
            </span>
            <strong>Voltar para home</strong>
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>

          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <div>
              <Map center={inicialPosition} zoom={15} onClick={handleMapClick}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={selectedPosition}/>
              </Map>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                  <option value="0">Selecione uma UF</option>
                  {states.map(state => (
                    <option key={state.sigla} value={state.sigla}>{`${state.sigla} | ${state.nome}`}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                  <option value="0">Selecione uma cidade</option>
                  {cities.map(city => (
                    <option key={city.nome} value={city.nome}>{city.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="number">Número</label>
                <input
                  type="number"
                  name="number"
                  id="number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field" />
            </div> 
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais items abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(item => (
                <li
                  key={item.id}
                  onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">
            Cadastrar ponto de coleta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoint;