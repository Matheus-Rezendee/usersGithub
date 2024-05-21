import { useState } from 'react'
import estilo from './app.module.css'
import axios from 'axios'

function App() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [erro, setErro] = useState(null)
  const [usuarios, setUsuarios] = useState([])

  // const usuarios = [
  //   {
  //     usuario: "usuário 01",
  //     urls: [
  //       "https://www.google.com",
  //       "https://www.facebook.com",
  //       "https://www.github.com"
  //     ]
  //   },
  //   {
  //     usuario: "usuário 02",
  //     urls: [
  //       "https://www.univas.edu.br",
  //       "https://www.fuvs.br",
  //       "https://www.hcsl.edu.br"
  //     ]
  //   }
  // ]

  axios.get("https://api.github.com/users")
    .then((res) => {
      setUsuarios(res.data)
    })

  function mudaUsuario(usuarioBuscado){
    const usuarioFiltrado = usuarios.filter(usuario => usuario.login == usuarioBuscado)
    if(usuarioFiltrado.length == 0){ // não encontrou usuário
      setErro(`O usuário '${usuarioBuscado}' não foi encontrado`)
    }else{
      setErro(null)
      setUsuarioSelecionado(usuarioFiltrado[0])
    }
  }

  function voltar(){
    setUsuarioSelecionado(null)
  }

  return (
    <div className='container mt-4'>
      {
        erro && (
          <p className='alert alert-danger'>{erro}</p>
        )
      }
      {
        // Se usuarioSelecionado não estiver preenchido
        // Mostra o conteúdo em tela
        !usuarioSelecionado && (
          <ul className='list-group'>
            {/* Ctrl + Shift + Alt + (setinha) */}
            {
              usuarios.map(usuario => {
                return (
                  <li key={usuario.login} onClick={() => mudaUsuario(usuario.login)} className={'list-group-item ' + estilo.cursor }>{usuario.login}</li>
                )
              })
            }
          </ul>
        )
      }

      {
        usuarioSelecionado && (
          <>
            <h2>
              { usuarioSelecionado.usuario }
              <span onClick={voltar} className='mx-3 fs-6 btn btn-secondary btn-sm'>Voltar</span>
            </h2>
            <p><strong>URLs:</strong> </p>
            <ul>
              { 
                usuarioSelecionado.urls.map((url, index) => {
                  return (
                    <li key={index}><a target="_blank" href={url}>{ url }</a></li>
                  )
                })
              }
            </ul>
            
          </>
        )
      }
      
    </div>
  )
}

export default App
