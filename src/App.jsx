import { useState } from 'react'
import estilo from './app.module.css'
import axios from 'axios'

function Aplicativo() {
  const [usuarioAtivo, definirUsuarioAtivo] = useState(null)
  const [mensagemErro, definirMensagemErro] = useState()
  const [listaUsuarios, definirListaUsuarios] = useState([])
  const [listaRepositorios, definirListaRepositorios] = useState([])
  const [listaSeguidores, definirListaSeguidores] = useState([])

  axios.get("https://api.github.com/users")
    .then((res) => {
      definirListaUsuarios(res.data)
    })

  function trocarUsuario(usuarioProcurado){
    const usuarioEncontrado = listaUsuarios.filter(usuario => usuario.login == usuarioProcurado)
    if(usuarioEncontrado.length == 0){
      definirMensagemErro(`Usuário '${usuarioProcurado}' não encontrado`)
    }else{
      definirMensagemErro(null)
      definirUsuarioAtivo(usuarioEncontrado[0])
    }
  }

  function retornar(){
    definirUsuarioAtivo(null)
    definirListaRepositorios([])
  }

  function obterRepositorios(evento){
    definirListaSeguidores([])
    evento.preventDefault()

    if(listaRepositorios.length > 0){
      definirListaRepositorios([])
    }else if(evento.target.href){
      axios.get(evento.target.href)
        .then((res) => {
          definirListaRepositorios(res.data)
        })
    }
  }
  function obterSeguidores(evento){
    evento.preventDefault()
    definirListaRepositorios([])
    if(listaSeguidores.length > 0){
      definirListaSeguidores([])
    }else if(evento.target.href){
      axios.get(evento.target.href)
        .then((res) => {
          definirListaSeguidores(res.data)
        })
    }
  }

  return (
    <div className='container mt-4'>
      {
        mensagemErro && (
          <p className='alert alert-danger'>{mensagemErro}</p>
        )
      }
      {
        // Se usuarioAtivo não estiver preenchido
        // Mostra o conteúdo em tela
        !usuarioAtivo && (
          <ul className='list-group'>
            {/* Ctrl + Shift + Alt + (setinha) */}
            {
              listaUsuarios.map(usuario => {
                return (
                  <li key={usuario.login} onClick={() => trocarUsuario(usuario.login)} className={'list-group-item ' + estilo.cursor}>
                    {usuario.login}
                  </li>
                )
              })
            }
          </ul>
        )
      }

      {
        usuarioAtivo && (
          <>
            <h2>
              <img src={usuarioAtivo.avatar_url} className={'img-fluid rounded-pill ' + estilo.avatar} />
              { usuarioAtivo.login } 
              <span onClick={retornar} className={'mx-3 fs-6 btn btn-secondary btn-sm'}>Voltar</span>
            </h2>
            <p><strong>URLs:</strong></p>
            <ul>
              <li>
                <a target='_blank' href={usuarioAtivo.html_url}>Perfil</a>
              </li>
              <li>
                <a onClick={obterRepositorios} target="_blank" href={usuarioAtivo.repos_url}>Repositórios</a>
              </li>
              <li>
                <a onClick={obterSeguidores} target="_blank" href={usuarioAtivo.followers_url}>Seguidores</a>
              </li>

            </ul>

            {
              listaRepositorios.length > 0 && (
                listaRepositorios.map(repo => {
                  return (
                    <div>
                      <p key={repo.name}>{repo.name}</p>
                      <p><a href={repo.url}>{repo.url}</a></p>
                      
                    </div>
                    
                  )
                })
              )
            }

            {
              listaSeguidores.length > 0 &&(
                listaSeguidores.map(repo=>{
                  return(<div>
                    <p><a href={repo.url}>{repo.url}</a></p>
                  </div>)
                })
              )
            }
          </>
        )
      }
      
    </div>
  )
}

export default Aplicativo
