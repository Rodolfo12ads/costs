import { useState, useEffect } from 'react';

import Input from '../form/Input';
import Select from '../form/Select';
import SubmitButton from '../form/SubmitButton';

import styles from './ProjectForm.module.css';

function ProjectForm({ handleSubmit, btnText, projectData }) {
    const [categories, setCategories] = useState([]); // Lista de categorias
    const [project, setProject] = useState({
        name: '',
        budget: '',
        category: { id: '', name: '' },
        ...projectData, // Dados recebidos sobrescrevem o inicial
    });

    // Carrega as categorias ao montar o componente
    useEffect(() => {
        fetch('https://costs-production-d20b.up.railway.app/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log('Categorias carregadas:', data); // Log para depuração
                setCategories(data);
            })
            .catch((err) => {
                console.error('Erro ao buscar categorias:', err);
            });
    }, []);

    // Função de envio do formulário
    const submit = (e) => {
        e.preventDefault();
        console.log('Dados enviados:', project); // Log para depuração
        handleSubmit(project); // Envia os dados para o handler externo
    };

    // Atualiza os campos de entrada (nome e orçamento)
    const handleChange = (e) => {
        setProject({
            ...project,
            [e.target.name]: e.target.value,
        });
    };

    // Atualiza a categoria selecionada
    const handleCategory = (e) => {
        const selectedIndex = e.target.selectedIndex; // Índice da opção selecionada
        const selectedOption = e.target.options[selectedIndex]; // Opção selecionada

        setProject({
            ...project,
            category: {
                id: e.target.value, // ID da categoria selecionada
                name: selectedOption.text, // Nome da categoria selecionada
            },
        });
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do projeto"
                name="name"
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                value={project.name || ''} // Valor seguro para evitar undefined
            />

            <Input
                type="number"
                text="Orçamento do projeto"
                name="budget"
                placeholder="Insira o orçamento total"
                handleOnChange={handleChange}
                value={project.budget || ''} // Valor seguro para evitar undefined
            />

            <Select
                name="category_id"
                text="Selecione a categoria"
                options={categories}
                handleOnChange={handleCategory}
                value={project.category?.id || ''} // Uso do operador opcional para evitar erros
            />

            <SubmitButton text={btnText} />
        </form>
    );
}

export default ProjectForm;
