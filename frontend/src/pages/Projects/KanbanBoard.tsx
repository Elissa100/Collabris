import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Avatar } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { Task, User } from '../../types';

interface KanbanBoardProps {
    tasks: Task[];
    projectMembers: User[];
    onTaskCreate: (data: any) => void;
    onTaskUpdate: (taskId: number, data: any) => void;
}

const columns = {
    'TO_DO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'DONE': 'Done',
};

const TaskCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided: DraggableProvided) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ p: 2, mb: 2, '&:hover': { bgcolor: 'action.hover' } }}
                >
                    <Typography variant="body1">{task.title}</Typography>
                    {task.assignee && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, mr: 1 }}>
                                {task.assignee.firstName?.charAt(0)}
                            </Avatar>
                            <Typography variant="caption">{task.assignee.username}</Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </Draggable>
    );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate }) => {

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const taskId = Number(draggableId);
        const newStatus = destination.droppableId;

        // This is where you'll trigger the update
        onTaskUpdate(taskId, { status: newStatus });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 1 }}>
                {Object.entries(columns).map(([columnId, columnTitle]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided: DroppableProvided) => (
                            <Paper
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ p: 2, width: 300, flexShrink: 0, bgcolor: 'background.default' }}
                            >
                                <Typography variant="h6" gutterBottom>{columnTitle}</Typography>
                                {tasks.filter(t => t.status === columnId).map((task, index) => (
                                    <TaskCard key={task.id} task={task} index={index} />
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
