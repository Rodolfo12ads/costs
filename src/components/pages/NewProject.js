import { useNavigate } from 'react-router-dom'; // useNavigate substitui useHistory no React Router v6+
import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css';

function NewProject() {
    const navigate = useNavigate(); // Função de navegação

    function createPost(project) {
        // Inicializa custo e serviços
        project.cost = 0;
        project.services = [];

        fetch('https://costs-production-d20b.up.railway.app/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                // Redirecionar para /projects após criar o projeto com sucesso
                navigate('/projects', { state: { message: 'Projeto criado com sucesso!' } }); // Adiciona `state` no redirecionamento
            })
            .catch((err) => console.error('Erro ao criar o projeto:', err));
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar projeto" />
        </div>
    );
}

export default NewProject;
