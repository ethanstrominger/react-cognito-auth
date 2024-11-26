import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../services/authService';

interface Project {
    id: number;
    name: string;
    description: string;
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        console.log("Use effect")
        const fetchProjects = async () => {
            try {
                const response = await makeGetRequest('http://localhost:8000/api/v1/projects/') || {data: ''};
                console.log("Response", response.data)
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        {project.name}: {project.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;
