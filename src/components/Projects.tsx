import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../services/authService';
import { redirectToLogin } from '../services/authService';
interface Project {
    uuid: string;
    name: string;
    description: string;
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await makeGetRequest('http://localhost:8000/api/v1/projects/');
                setProjects(response.data);
            }
            catch(error) {
                console.error(error, "Error fetching. Redirecting to login.")
                redirectToLogin();
                return;
            }

        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project) => (
                    <li key={project.uuid}>
                        {project.name}: {project.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Projects;
