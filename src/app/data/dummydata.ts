// dummydata.ts
import { v4 as uuidv4 } from 'uuid';
import { TaskData } from '../common/modal/taskmodal';

export const dummyCategories = [
    { id: 'cat-home', label: 'Home' },
    { id: 'cat-work', label: 'Work' },
];

export const dummyTasks: TaskData[] = [
    {
        id: uuidv4(),
        name: 'Buy groceries',
        tag: 'On Going',
        deadline: '2025-06-25',
        remarks: 'From the nearby store',
        categoryId: 'cat-home',
    },
    {
        id: uuidv4(),
        name: 'Complete UI design',
        tag: 'Completed',
        deadline: '2025-06-15',
        remarks: 'Main screen done',
        categoryId: 'cat-work',
    },
    {
        id: uuidv4(),
        name: 'Fix bug report',
        tag: 'Trash',
        deadline: '2025-06-12',
        remarks: 'Check subtask drag bug',
        categoryId: null,
    },
];
