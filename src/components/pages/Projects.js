import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Message from '../layout/Message';
import Container from '../layout/Container';
import Loading from '../layout/Loading';
import styles from './Projects.module.css';
import LinkButton from './LinkButton';
import ProjectCard from '../project/ProjectCard';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const location = useLocation();
    const message = location.state?.message || ''; // Mensagem opcional
    const[projectMessage, setProjectMessage]= useState('')

    // Fetch dos projetos ao carregar a página
    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProjects(data);
                    setRemoveLoading(true);
                })
                .catch((err) => console.error('Erro ao buscar projetos:', err));
        }, 300);
    }, []);

    // Função para remover projetos
    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Erro ao excluir o projeto');
                }
                return resp.json();
            })
            .then(() => {
                setProjects(projects.filter((project) => project.id !== id));
                setProjectMessage('Projeto removido com sucesso!')
            })
            .catch((err) => console.error('Erro ao excluir projeto:', err));
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category?.name}
                            handleRemove={removeProject}
                        />
                    ))
                ) : (
                    removeLoading && <p>Não há projetos cadastrados!</p>
                )}
                {!removeLoading && <Loading />}
            </Container>
        </div>
    );
}

export default Projects;
