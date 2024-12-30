import { v4 as uuidv4} from 'uuid'

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../layout/Loading';
import styles from './Project.module.css';
import Container from '../layout/Container';
import ServiceForm from '../service/ServiceForm';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message'
import ServiceCard from '../service/ServiceCard'

function Project() {
    const { id } = useParams(); // Obtém o ID da URL
    
    const [project, setProject] = useState([]); // Estado inicial como `null`
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState()
    const [type, setType] = useState()
    // useEffect para buscar os dados do projeto com base no ID
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:5000/projects/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar o projeto');
                }

                const data = await response.json();
                setProject(data); // Atualiza o estado com os dados do projeto
                setServices(data.services)
            } catch (err) {
                console.error('Erro ao buscar o projeto:', err);
            }
        };

        // Simula carregamento com timeout para testes
        setTimeout(fetchProject, 300);
    }, [id]);

    function editPost(project) {
        if (project.budget < project.cost) {
            setMessage(' O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                'Content-type': 'application.json',
            },
            body: JSON.stringify(project),
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage(' Projeto atualizado!')
                setType('success')
                setTimeout(setMessage, 3000);
            })
            .catch(err => console.log(err))
    }

    function createService(){
        const lastService = project.services[project.services.length -1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newcost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // maximum value validation

        if( newcost > parseFloat(project.budget)){
            setMessage('Orcamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        // add service cost to project total cost

        project.cost = newcost

        // update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method : "PATCH", 
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    function removeService(id, cost){
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project
        projectUpdated.services = serviceUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json())
        .then((data) =>{
            setProject(projectUpdated)
            setServices(serviceUpdate)
            setMessage('Servico removido com sucesso!')
        })
        .catch(err => console.log(err))

    }

    // Alterna entre mostrar ou esconder o formulário de edição
    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {showProjectForm ? (
                                <div key="editForm" className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost}
                                        btnText="conluir edição"
                                        projectData={project}
                                    />
                                </div>

                            ) : (
                                <div className={styles.project_info} key="projectDetails">
                                    <p>
                                        <span>Categoria:</span> {project.category?.name || 'Não definido'}
                                    </p>
                                    <p>
                                        <span>Total de orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado:</span> R${project.cost || 0}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={styles.services_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviços"
                                    projectData={project}
                                />}
                            </div>
                        </div>
                        <div className={styles.services_form_container}>
                            <h2 >serviços</h2>
                            <Container customClass="start">
                               {services.length > 0 &&
                               services.map((service) =>(
                                <ServiceCard
                                id = {service.id}
                                name = {service.name}
                                cost = {service.cost}
                                description = {service.description}
                                key = {service.id}
                                handleRemove = {removeService}
                                />
                               ))

                               }
                               {services.length ===0 && <p>Não há seviços cadastrados.</p>}
                            </Container>
                        </div>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
