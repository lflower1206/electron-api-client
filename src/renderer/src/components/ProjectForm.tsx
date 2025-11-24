import { useState, FormEvent } from 'react';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { Project } from '@renderer/types';

export interface ProjectFormProps {
    project?: Project;
    onSubmit: (name: string, description: string) => void;
    onCancel: () => void;
}

const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
    const [name, setName] = useState(project?.name || '');
    const [description, setDescription] = useState(project?.description || '');
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { name?: string; description?: string } = {};
        if (!name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(name, description);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My API Project"
                error={errors.name}
                autoFocus
            />

            <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your project..."
                rows={4}
                error={errors.description}
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    {project ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;
