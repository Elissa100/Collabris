import React from 'react';
import { Box, Paper, Typography, Button, Avatar, Chip, Tooltip } from '@mui/material'; // <-- IMPORT Chip & Tooltip
import { Add as AddIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { Task, User, TaskPriority } from '../../types';

interface KanbanBoardProps {
    tasks: Task[];
    projectMembers: User[];
    onTaskClick: (task: Task) => void; // <-- ADDED: To open the modal
    onTaskUpdate: (taskId: number, data: any) => void;
}

const columns = {
    'TO_DO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'DONE': 'Done',
};

// --- NEW: Helper function for priority colors ---
const getPriorityChipColor = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.URGENT: return "error";
        case TaskPriority.HIGH: return "warning";
        case TaskPriority.MEDIUM: return "primary";
        case TaskPriority.LOW: return "info";
        default: return "default";
    }
};

const TaskCard: React.FC<{ task: Task; index: number; onClick: () => void }> = ({ task, index, onClick }) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided: DraggableProvided) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick} // <-- ADDED
                    sx={{ p: 2, mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                    <Typography variant="body1" sx={{ mb: 1 }}>{task.title}</Typography>
                    
                    {/* --- NEW: Display Priority and Due Date --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                        <Chip
                            label={task.priority}
                            color={getPriorityChipColor(task.priority)}
                            size="small"
                        />
                        {task.dueDate && (
                            <Tooltip title={`Due: ${task.dueDate}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="caption">{task.dueDate}</Typography>
                                </Box>
                            </Tooltip>
                        )}
                    </Box>

                    {task.assignee && (
                        <Tooltip title={`Assigned to ${task.assignee.username}`}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, mt: 1, ml: 'auto' }}>
                                {task.assignee.firstName?.charAt(0)}
                            </Avatar>
                        </Tooltip>
                    )}
                </Paper>
            )}
        </Draggable>
    );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate, onTaskClick }) => {

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const taskId = Number(draggableId);
        const newStatus = destination.droppableId;

        onTaskUpdate(taskId, { status: newStatus });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 1, height: '100%' }}>
                {Object.entries(columns).map(([columnId, columnTitle]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided: DroppableProvided) => (
                            <Paper
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ p: 2, width: 300, flexShrink: 0, bgcolor: 'background.default', overflowY: 'auto' }}
                            >
                                <Typography variant="h6" gutterBottom>{columnTitle}</Typography>
                                {tasks.filter(t => t.status === columnId).map((task, index) => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={task} 
                                        index={index}
                                        onClick={() => onTaskClick(task)} // <-- ADDED
                                    />
                                ))}
                                {provided.placeholder}
                            </Paper>
                        )}
                    </Droppable>
                ))}
            </Box>
        </DragDropContext>
    );
};

export default KanbanBoard;